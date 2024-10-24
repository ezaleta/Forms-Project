const express = require('express');
const router = express.Router();
const { Form, Template, Question, FormAnswer } = require('../../../models');
const auth = require('../../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { templateId, answers } = req.body;

        const template = await Template.findByPk(templateId, {
            include: [{ model: Question }],
        });
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        for (const question of template.Questions) {
            const answer = answers.find(
                ans => parseInt(ans.questionId) === question.id
            );
            if (question.isRequired && (!answer || !answer.answer.trim())) {
                return res.status(400).json({
                    message: `Answer is required for question: "${question.text}"`,
                });
            }
        }

        const form = await Form.create({
            userId: req.user.id,
            templateId,
        });

        const formAnswersData = answers.map(answer => ({
            formId: form.id,
            questionId: answer.questionId,
            answer: answer.answer,
        }));

        await FormAnswer.bulkCreate(formAnswersData);

        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const forms = await Form.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Template,
                    attributes: ['title'],
                },
            ],
        });

        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/myForms', auth, async (req, res) => {
    try {
        const forms = await Form.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Template,
                    attributes: ['title'],
                },
                {
                    model: FormAnswer,
                    include: [
                        {
                            model: Question,
                            attributes: ['text', 'type'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const form = await Form.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [
                {
                    model: FormAnswer,
                    include: [
                        {
                            model: Question,
                            attributes: ['text', 'type'],
                        },
                    ],
                },
                {
                    model: Template,
                    attributes: ['title'],
                },
            ],
        });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        if (form.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(form);
    } catch (error) {
        console.error('Error fetching form:', error);
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
            await FormAnswer.create({
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
