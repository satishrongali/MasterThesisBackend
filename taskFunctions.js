// taskFunctions.js
require('dotenv').config();
const mongoose = require('./db/db');
const { Task } = require('./db/models/task.model');
const authenticate = require('./middleware/authenticate');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getTasksInList = [authenticate, (req, res) => {
    Task.find({ _listId: req.params.listId })
        .then(tasks => {
            if (!tasks || tasks.length === 0) return res.status(404).json({ message: 'No tasks found for this list' });
            res.status(200).json(tasks);
        })
        .catch(err => res.status(500).json({ error: "Error fetching tasks: " + err.message }));
}];

exports.createTaskInList = [authenticate, (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save()
        .then(task => res.status(201).json(task))
        .catch(err => res.status(500).json({ error: "Error creating task: " + err.message }));
}];

exports.updateTask = [authenticate, (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.taskId, _listId: req.params.listId }, { $set: req.body }, { new: true })
        .then(task => {
            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json(task);
        })
        .catch(err => res.status(500).json({ error: "Error updating task: " + err.message }));
}];

exports.deleteTask = [authenticate, (req, res) => {
    Task.findOneAndRemove({ _id: req.params.taskId, _listId: req.params.listId })
        .then(result => {
            if (!result) return res.status(404).json({ message: "Task not found" });
            res.status(200).json({ message: 'Task deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: "Error deleting task: " + err.message }));
}];
