// listFunctions.js
require('dotenv').config();

const mongoose = require('./db/db');
const { List } = require('./db/models/list.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.getAllLists = (req, res) => {
    List.find({ _userId: req.user_id })
        .then(lists => res.status(200).json(lists))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.createList = (req, res) => {
    let newList = new List({
        title: req.body.title,
        _userId: req.user_id
    });
    newList.save()
        .then(list => res.status(201).json(list))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.updateList = (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, { $set: req.body }, { new: true })
        .then(list => res.status(200).json(list))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteList = (req, res) => {
    List.findOneAndRemove({ _id: req.params.id, _userId: req.user_id })
        .then(result => res.status(200).json({ message: 'List deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
};
