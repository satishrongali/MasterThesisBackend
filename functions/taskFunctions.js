const { Task } = require('./db/models/task.model');
const { List } = require('./db/models/list.model');
const authenticate = require('./middleware/authenticate');

exports.getTasksInList = (req, res) => {
    Task.find({ _listId: req.params.listId })
        .then((tasks) => res.status(200).json(tasks))
        .catch((err) =>
            res.status(500).json({
                error: 'Error fetching tasks: ' + (err ? err.message : 'Unknown error'),
            })
        );
};

exports.createTaskInList = (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id }).then((list) => {
        if (!list) return res.status(404).json({ message: 'List not found' });

        let newTask = new Task({
            title: req.body.title,
            _listId: req.params.listId,
        });

        newTask
            .save()
            .then((task) => res.status(201).json(task))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error creating task: ' + (err ? err.message : 'Unknown error'),
                })
            );
    });
};

exports.updateTask = (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id }).then((list) => {
        if (!list) return res.status(404).json({ message: 'List not found' });

        Task.findOneAndUpdate({ _id: req.params.taskId, _listId: req.params.listId }, { $set: req.body }, { new: true })
            .then((task) => {
                if (!task) return res.status(404).json({ message: 'Task not found' });
                res.status(200).json(task);
            })
            .catch((err) =>
                res.status(500).json({
                    error: 'Error updating task: ' + (err ? err.message : 'Unknown error'),
                })
            );
    });
};

exports.deleteTask = (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id }).then((list) => {
        if (!list) return res.status(404).json({ message: 'List not found' });

        Task.findOneAndDelete({
            _id: req.params.taskId,
            _listId: req.params.listId,
        })
            .then((task) => {
                if (!task) return res.status(404).json({ message: 'Task not found' });
                res.status(200).json({ message: 'Task deleted successfully' });
            })
            .catch((err) =>
                res.status(500).json({
                    error: 'Error deleting task: ' + (err ? err.message : 'Unknown error'),
                })
            );
    });
};
