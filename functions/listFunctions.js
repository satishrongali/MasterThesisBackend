const { List } = require('./db/models/list.model');

exports.getAllLists = (req, res) => {
    List.find({ _userId: req.user_id })
        .then((lists) => res.status(200).json(lists))
        .catch((err) =>
            res.status(500).json({
                error: 'Error fetching lists: ' + (err ? err.message : 'Unknown error'),
            })
        );
};

exports.createList = (req, res) => {
    let newList = new List({
        title: req.body.title,
        _userId: req.user_id,
    });
    newList
        .save()
        .then((list) => res.status(201).json(list))
        .catch((err) =>
            res.status(500).json({
                error: 'Error creating list: ' + (err ? err.message : 'Unknown error'),
            })
        );
};

exports.updateList = (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, { $set: req.body }, { new: true })
        .then((list) => {
            if (!list) return res.status(404).json({ message: 'List not found' });
            res.status(200).json(list);
        })
        .catch((err) =>
            res.status(500).json({
                error: 'Error updating list: ' + (err ? err.message : 'Unknown error'),
            })
        );
};

exports.deleteList = (req, res) => {
    List.findOneAndDelete({ _id: req.params.id, _userId: req.user_id })
        .then((result) => {
            if (!result) return res.status(404).json({ message: 'List not found' });
            res.status(200).json({ message: 'List deleted successfully' });
        })
        .catch((err) =>
            res.status(500).json({
                error: 'Error deleting list: ' + (err ? err.message : 'Unknown error'),
            })
        );
};
