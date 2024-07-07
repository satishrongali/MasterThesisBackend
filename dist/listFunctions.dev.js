"use strict";

// listFunctions.js
require('dotenv').config();

var mongoose = require('./db/db');

var _require = require('./db/models/list.model'),
    List = _require.List; // Connect to MongoDB


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.getAllLists = function (req, res) {
  List.find({
    _userId: req.user_id
  }).then(function (lists) {
    return res.status(200).json(lists);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.createList = function (req, res) {
  var newList = new List({
    title: req.body.title,
    _userId: req.user_id
  });
  newList.save().then(function (list) {
    return res.status(201).json(list);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.updateList = function (req, res) {
  List.findOneAndUpdate({
    _id: req.params.id,
    _userId: req.user_id
  }, {
    $set: req.body
  }, {
    "new": true
  }).then(function (list) {
    return res.status(200).json(list);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.deleteList = function (req, res) {
  List.findOneAndRemove({
    _id: req.params.id,
    _userId: req.user_id
  }).then(function (result) {
    return res.status(200).json({
      message: 'List deleted successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};
//# sourceMappingURL=listFunctions.dev.js.map
