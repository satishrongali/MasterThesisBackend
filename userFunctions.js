require('dotenv').config();
const { User } = require('./db/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticate = require('./middleware/authenticate');
const verifySession = require('./middleware/verifySession');

// Register User
exports.registerUser = (req, res) => {
    let { email, password } = req.body;

    User.findOne({ email }).then(existingUser => {
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        let newUser = new User({ email, password });
        newUser.save().then(user => {
            return user.createSession().then((refreshToken) => {
                return user.generateAccessAuthToken().then((accessToken) => {
                    return { accessToken, refreshToken };
                });
            }).then((authTokens) => {
                res.header('x-refresh-token', authTokens.refreshToken)
                    .header('x-access-token', authTokens.accessToken)
                    .send(user);
            });
        }).catch(err => res.status(500).json({ error: 'Error saving user: ' + err.message }));
    }).catch(err => res.status(500).json({ error: 'Error checking user: ' + err.message }));
};

// Login User
exports.loginUser = (req, res) => {
    let { email, password } = req.body;

    User.findByCredentials(email, password).then(user => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken };
            });
        }).then((authTokens) => {
            res.header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        });
    }).catch((e) => {
        res.status(400).json({ error: 'Login failed' });
    });
};

exports.refreshAccessToken = (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((err) => {
        res.status(400).send(err);
    });
};

exports.updateUserProfile = [authenticate, (req, res) => {
    User.findByIdAndUpdate(req.user_id, { $set: req.body }, { new: true })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ error: "Error updating user profile: " + (err ? err.message : 'Unknown error') }));
}];

exports.changeUserPassword = [authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hash = await bcrypt.hash(req.body.password, 10);
        user.password = req.body.password;

        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error changing password: " + (err ? err.message : 'Unknown error') });
    }
}];


exports.deleteUser = [authenticate, (req, res) => {
    User.findByIdAndRemove(req.user_id)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: "Error deleting user: " + (err ? err.message : 'Unknown error') }));
}];
