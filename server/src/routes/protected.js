const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.send(`Hello, user ${req.user.id}. This is a protected route.`);
});

module.exports = router;
