const { User } = require('./db/models/user.model');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Error fetching users: " + (err ? err.message : 'Unknown error') });
    }
};

// Admin change password
exports.adminChangePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = req.body.newPassword; // Set the new password
        await user.save(); // Save triggers the pre-save hook to hash the password
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error changing password: " + (err ? err.message : 'Unknown error') });
    }
};

// Admin change email
exports.adminChangeEmail = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { email: req.body.newEmail }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Error updating email: " + (err ? err.message : 'Unknown error') });
    }
};

// Grant admin rights
exports.grantAdminRights = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isAdmin: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Error granting admin rights: " + (err ? err.message : 'Unknown error') });
    }
};

// Admin delete user
exports.adminDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error deleting user: " + (err ? err.message : 'Unknown error') });
    }
};
