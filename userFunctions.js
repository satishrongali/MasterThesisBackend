// userFunctions.js
require('dotenv').config();
const mongoose = require('./db/db');
const { User } = require('./db/models/user.model');
const jwt = require('jsonwebtoken');
const authenticate = require('./middleware/authenticate');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// userFunctions.js

exports.registerUser = (req, res) => {
    let { email, password } = req.body;
    
    // First check if a user with the same email already exists
    User.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                // If user exists, send a conflict error
                return res.status(409).json({ error: 'Email already in use.' });
            }

            // If no existing user, create a new user
            let newUser = new User({ email, password });
            newUser.save()
                .then(user => res.status(201).json(user))
                .catch(err => res.status(500).json({ error: 'Error saving user: ' + err.message }));
        })
        .catch(err => res.status(500).json({ error: 'Error checking user: ' + err.message }));
};


exports.loginUser = (req, res) => {
    let { email, password } = req.body;
    User.findByCredentials(email, password)
        .then(user => {
            // Create JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Return both user info and token
            return res.status(200).json({
                user: {
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token: token  // This is the JWT token
            });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
};

exports.refreshAccessToken = [authenticate, (req, res) => {
    const refreshToken = req.header('x-refresh-token');
    const userId = req.header('_id');
    User.findByIdAndToken(userId, refreshToken)
        .then(user => user.generateAccessAuthToken())
        .then(accessToken => res.header('x-access-token', accessToken).send({ accessToken }))
        .catch(err => res.status(500).json({ error: "Error refreshing access token: " + err.message }));
}];

exports.updateUserProfile = [authenticate, (req, res) => {
    User.findByIdAndUpdate(req.user_id, { $set: req.body }, { new: true })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ error: "Error updating user profile: " + err.message }));
}];

exports.changeUserPassword = [authenticate, (req, res) => {
    User.findById(req.user_id)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            user.password = req.body.password;
            return user.save();
        })
        .then(() => res.status(200).json({ message: 'Password updated successfully' }))
        .catch(err => res.status(500).json({ error: "Error changing password: " + err.message }));
}];

exports.deleteUser = [authenticate, (req, res) => {
    User.findByIdAndRemove(req.user_id)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: "Error deleting user: " + err.message }));
}];
