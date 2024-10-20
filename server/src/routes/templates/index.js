const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Template, Question, User, Tag } = require('../../../models');
const auth = require('../../middleware/auth');

router.post(
    '/',
    auth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('topic').notEmpty().withMessage('Topic is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, topic, isPublic, tags } = req.body;
            const template = await Template.create({
                title,
                description,
                topic,
                isPublic,
                authorId: req.user.id,
            });

            res.status(201).json(template);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

router.get('/', auth, async (req, res) => {
    try {
        const templates = await Template.findAll({
            where: {
                [Op.or]: [{ isPublic: true }, { authorId: req.user.id }],
            },
            include: [{ model: User, as: 'author' }, { model: Tag }],
        });
        res.json(templates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id, {
            include: [{ model: Question }, { model: Tag }],
        });
        if (!template)
            return res.status(404).json({ message: 'Template not found' });
        res.json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/mine', auth, async (req, res) => {
    try {
        const templates = await Template.findAll({
            where: { authorId: req.user.id },
            include: [{ model: Tag }],
        });
        res.json(templates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/mine', auth, async (req, res) => {
    try {
        const forms = await Form.findAll({
            where: { userId: req.user.id },
            include: [{ model: Template }],
        });
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template)
            return res.status(404).json({ message: 'Template not found' });

        if (template.authorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { title, description, topic, isPublic, tags } = req.body;
        await template.update({ title, description, topic, isPublic });

        if (tags) {
            const tagRecords = await Promise.all(
                tags.map(async tagName => {
                    const [tag] = await Tag.findOrCreate({
                        where: { name: tagName },
                    });
                    return tag;
                })
            );
            await template.setTags(tagRecords);
        }

        res.json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template)
            return res.status(404).json({ message: 'Template not found' });

        if (template.authorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await template.destroy();
        res.json({ message: 'Template deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
