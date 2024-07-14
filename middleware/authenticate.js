const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    const token = tokenParts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded._id) {
            return res.status(400).json({ message: 'Invalid token: ID not present.' });
        }
        req.user_id = decoded._id;  // Attach the user ID to the request object
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token: ' + ex.message });
    }
}

module.exports = authenticate;
