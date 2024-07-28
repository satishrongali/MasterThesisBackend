const jwt = require('jsonwebtoken');
const { User } = require('../db/models/user.model');

function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    const token = tokenParts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded._id) {
            return res.status(400).json({ message: 'Invalid token: ID not present.' });
        }
        req.user_id = decoded._id;
        User.findById(req.user_id).then((user) => {
            if (!user || !user.isAdmin) {
                return res.status(401).json({ message: 'Access denied. Admin privileges required.' });
            }
            next();
        });
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token: ' + ex.message });
    }
}

module.exports = authenticateAdmin;
