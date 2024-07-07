"use strict";

// userFunctions.js
require('dotenv').config();

var mongoose = require('./db/db');

var _require = require('./db/models/user.model'),
    User = _require.User;

var jwt = require('jsonwebtoken'); // Connect to MongoDB


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.registerUser = function (req, res) {
  var newUser = new User(req.body);
  newUser.save().then(function (user) {
    return res.status(201).json(user);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.loginUser = function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;
  User.findByCredentials(email, password).then(function (user) {
    return user.createSession();
  }).then(function (session) {
    return res.status(200).json(session);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.refreshAccessToken = function (req, res) {
  var refreshToken = req.header('x-refresh-token');
  var userId = req.header('_id');
  User.findByIdAndToken(userId, refreshToken).then(function (user) {
    return user.generateAccessAuthToken();
  }).then(function (accessToken) {
    return res.header('x-access-token', accessToken).send({
      accessToken: accessToken
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.updateUserProfile = function (req, res) {
  User.findByIdAndUpdate(req.user_id, {
    $set: req.body
  }, {
    "new": true
  }).then(function (user) {
    return res.status(200).json(user);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.changeUserPassword = function (req, res) {
  User.findById(req.user_id).then(function (user) {
    user.password = req.body.password;
    return user.save();
  }).then(function () {
    return res.status(200).json({
      message: 'Password updated successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.deleteUser = function (req, res) {
  User.findByIdAndRemove(req.user_id).then(function () {
    return res.status(200).json({
      message: 'User deleted successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};
//# sourceMappingURL=userFunctions.dev.js.map
