// userFunctions.js
require('dotenv').config();


const mongoose = require('./db/db');
const { User } = require('./db/models/user.model');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.registerUser = (req, res) => {
    let newUser = new User(req.body);
    newUser.save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.loginUser = (req, res) => {
    let { email, password } = req.body;
    User.findByCredentials(email, password)
        .then(user => user.createSession())
        .then(session => res.status(200).json(session))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.refreshAccessToken = (req, res) => {
    const refreshToken = req.header('x-refresh-token');
    const userId = req.header('_id');
    User.findByIdAndToken(userId, refreshToken)
        .then(user => user.generateAccessAuthToken())
        .then(accessToken => res.header('x-access-token', accessToken).send({ accessToken }))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.updateUserProfile = (req, res) => {
    User.findByIdAndUpdate(req.user_id, { $set: req.body }, { new: true })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.changeUserPassword = (req, res) => {
    User.findById(req.user_id)
        .then(user => {
            user.password = req.body.password;
            return user.save();
        })
        .then(() => res.status(200).json({ message: 'Password updated successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.user_id)
        .then(() => res.status(200).json({ message: 'User deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};
