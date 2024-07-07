// adminFunctions.js
require('dotenv').config();


const mongoose = require('./db/db');
const { User } = require('./db/models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getAllUsers = (req, res) => {
    User.find({})
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.adminChangePassword = (req, res) => {
    User.findOne({ _id: req.params.userId })
        .then(user => {
            user.password = req.body.password;
            return user.save();
        })
        .then(() => res.status(200).json({ message: 'Password changed successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.adminChangeEmail = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, { email: req.body.email }, { new: true })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.grantAdminRights = (req, res) => {
    User.findByIdAndUpdate(req.params.userId, { isAdmin: true }, { new: true })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.adminDeleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(() => res.status(200).json({ message: 'User deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};
