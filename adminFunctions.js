// adminFunctions.js
require('dotenv').config();
const mongoose = require('./db/db');
const { User } = require('./db/models/user.model');
const authenticate = require('./middleware/authenticate');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getAllUsers = [authenticate, (req, res) => {
    User.find({})
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: "Error fetching users: " + err.message }));
}];

exports.adminChangePassword = [authenticate, (req, res) => {
    User.findOne({ _id: req.params.userId })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            user.password = req.body.password;
            return user.save();
        })
        .then(() => res.status(200).json({ message: 'Password changed successfully' }))
        .catch(err => res.status(500).json({ error: "Error changing password: " + err.message }));
}];

exports.adminChangeEmail = [authenticate, (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, { email: req.body.email }, { new: true })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ error: "Error changing email: " + err.message }));
}];

exports.grantAdminRights = [authenticate, (req, res) => {
    User.findByIdAndUpdate(req.params.userId, { isAdmin: true }, { new: true })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ error: "Error granting admin rights: " + err.message }));
}];

exports.adminDeleteUser = [authenticate, (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: "Error deleting user: " + err.message }));
}];
