"use strict";

var mongoose = require('./mongoose');

var Task = require('./models/task.model');

exports.getTasks = function (req, res) {
  Task.find({}, function (err, tasks) {
    if (err) {
      return res.status(500).send(err);
    }

    res.status(200).send(tasks);
  });
};
//# sourceMappingURL=getTask.dev.js.map
