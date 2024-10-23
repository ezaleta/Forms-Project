const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { User } = require('../../../models');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'isAdmin'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/me', auth, async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const user = await User.findByPk(req.user.id);

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        await user.destroy();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
