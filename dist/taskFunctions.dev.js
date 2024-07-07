"use strict";

// taskFunctions.js
require('dotenv').config();

var mongoose = require('./db/db');

var _require = require('./db/models/task.model'),
    Task = _require.Task; // Connect to MongoDB


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.getTasksInList = function (req, res) {
  Task.find({
    _listId: req.params.listId
  }).then(function (tasks) {
    return res.status(200).json(tasks);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.createTaskInList = function (req, res) {
  var newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId
  });
  newTask.save().then(function (task) {
    return res.status(201).json(task);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.updateTask = function (req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId,
    _listId: req.params.listId
  }, {
    $set: req.body
  }, {
    "new": true
  }).then(function (task) {
    return res.status(200).json(task);
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};

exports.deleteTask = function (req, res) {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId
  }).then(function (result) {
    return res.status(200).json({
      message: 'Task deleted successfully'
    });
  })["catch"](function (err) {
    return res.status(500).json({
      error: err.message
    });
  });
};
//# sourceMappingURL=taskFunctions.dev.js.map
