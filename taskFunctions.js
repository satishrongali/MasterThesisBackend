// taskFunctions.js
require('dotenv').config();


const mongoose = require('./db/db');
const { Task } = require('./db/models/task.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getTasksInList = (req, res) => {
    Task.find({ _listId: req.params.listId })
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.createTaskInList = (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save()
        .then(task => res.status(201).json(task))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.updateTask = (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.taskId, _listId: req.params.listId }, { $set: req.body }, { new: true })
        .then(task => res.status(200).json(task))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteTask = (req, res) => {
    Task.findOneAndRemove({ _id: req.params.taskId, _listId: req.params.listId })
        .then(result => res.status(200).json({ message: 'Task deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};
