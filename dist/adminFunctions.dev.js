"use strict";

// adminFunctions.js
require('dotenv').config();

var mongoose = require('./db/db');

var _require = require('./db/models/user.model'),
    User = _require.User; // Connect to MongoDB


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.getAllUsers = function (req, res) {
  User.find({}).then(function (users) {
    return res.status(200).json(users);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.adminChangePassword = function (req, res) {
  User.findOne({
    _id: req.params.userId
  }).then(function (user) {
    user.password = req.body.password;
    return user.save();
  }).then(function () {
    return res.status(200).json({
      message: 'Password changed successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.adminChangeEmail = function (req, res) {
  User.findOneAndUpdate({
    _id: req.params.userId
  }, {
    email: req.body.email
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

exports.grantAdminRights = function (req, res) {
  User.findByIdAndUpdate(req.params.userId, {
    isAdmin: true
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

exports.adminDeleteUser = function (req, res) {
  User.findByIdAndRemove(req.params.userId).then(function () {
    return res.status(200).json({
      message: 'User deleted successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};
//# sourceMappingURL=adminFunctions.dev.js.map
