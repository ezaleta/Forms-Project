const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader)
        return res
            .status(401)
            .json({ message: 'No token provided, authorization denied' });

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(400).json({ message: 'Invalid token.' });
    }
};
