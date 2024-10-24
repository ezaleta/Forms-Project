const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User, Template, Form } = require('../../models');

router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'isAdmin'],
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/users/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/users/:id/promote', auth, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAdmin = true;
        await user.save();

        res.json({ message: 'User promoted to admin' });
    } catch (error) {
        console.error('Error promoting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/users/:id/demote', auth, admin, async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId == req.user.id) {
            return res
                .status(400)
                .json({ message: 'You cannot demote yourself.' });
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAdmin = false;
        await user.save();

        res.json({ message: 'User demoted from admin' });
    } catch (error) {
        console.error('Error demoting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/templates', auth, admin, async (req, res) => {
    try {
        const templates = await Template.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['firstName', 'lastName'],
                },
            ],
        });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/templates/:id', auth, admin, async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template)
            return res.status(404).json({ message: 'Template not found' });

        await template.destroy();
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
