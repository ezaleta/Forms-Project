const express = require('express');
const router = express.Router();
const { Form, Answer, Template, Question } = require('../../../models');
const auth = require('../../middleware/auth');

router.get('/myForms', auth, async (req, res) => {
    try {
        const forms = await Form.findAll({
            where: { userId: req.user.id },
            include: [{ model: Template }],
        });
        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:templateId', auth, async (req, res) => {
    try {
        const { templateId } = req.params;
        const { answers } = req.body;

        const template = await Template.findByPk(templateId, {
            include: [{ model: Question }],
        });
        if (!template)
            return res.status(404).json({ message: 'Template not found' });

        const form = await Form.create({
            userId: req.user.id,
            templateId,
        });

        for (const answerData of answers) {
            await Answer.create({
                formId: form.id,
                questionId: answerData.questionId,
                value: answerData.value,
            });
        }

        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
