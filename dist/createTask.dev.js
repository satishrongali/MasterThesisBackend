"use strict";

var mongoose = require('./mongoose');

var Task = require('./models/task.model');

exports.createTask = function (req, res) {
  var task = new Task(req.body);
  task.save(function (err, savedTask) {
    if (err) {
      return res.status(500).send(err);
    }

    res.status(201).send(savedTask);
  });
};
//# sourceMappingURL=createTask.dev.js.map
