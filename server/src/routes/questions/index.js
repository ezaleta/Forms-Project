const express = require('express');
const router = express.Router();
const { Question, Template } = require('../../../models');
const auth = require('../../middleware/auth');

router.post('/:templateId', auth, async (req, res) => {
    try {
        const { templateId } = req.params;
        const { title, description, type, isInResultsTable, order } = req.body;

        const template = await Template.findByPk(templateId);
        if (!template)
            return res.status(404).json({ message: 'Template not found' });

        if (template.authorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const question = await Question.create({
            title,
            description,
            type,
            isInResultsTable,
            order,
            templateId,
        });

        res.status(201).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
