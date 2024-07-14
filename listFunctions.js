require('dotenv').config();
const mongoose = require('./db/db');
const { List } = require('./db/models/list.model');
const authenticate = require('./middleware/authenticate');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getAllLists = [authenticate, (req, res) => {
    List.find({ _userId: req.user_id })
        .then(lists => res.status(200).json(lists))
        .catch(err => res.status(500).json({ error: "Error fetching lists: " + err.message }));
}];

exports.createList = [authenticate, (req, res) => {
    let newList = new List({
        title: req.body.title,
        _userId: req.user_id
    });
    newList.save()
        .then(list => res.status(201).json(list))
        .catch(err => res.status(500).json({ error: "Error creating list: " + err.message }));
}];

exports.updateList = [authenticate, (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, { $set: req.body }, { new: true })
        .then(list => {
            if (!list) return res.status(404).json({ message: "List not found" });
            res.status(200).json(list);
        })
        .catch(err => res.status(500).json({ error: "Error updating list: " + err.message }));
}];

exports.deleteList = [authenticate, (req, res) => {
    List.findOneAndRemove({ _id: req.params.id, _userId: req.user_id })
        .then(result => {
            if (!result) return res.status(404).json({ message: "List not found" });
            res.status(200).json({ message: 'List deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: "Error deleting list: " + err.message }));
}];
