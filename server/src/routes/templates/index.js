const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    Template,
    Question,
    User,
    Tag,
    Comment,
    Like,
} = require('../../../models');
const { Op } = require('sequelize');
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
            const { title, description, topic, isPublic, questions, tag } =
                req.body;
            const template = await Template.create({
                title,
                description,
                topic,
                isPublic,
                authorId: req.user.id,
            });

            if (questions && questions.length > 0) {
                const questionData = questions.map(q => ({
                    ...q,
                    templateId: template.id,
                }));

                await Question.bulkCreate(questionData);
            }

            res.status(201).json(template);
        } catch (error) {
            console.error('Error creating template:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

router.get('/myTemplates', auth, async (req, res) => {
    try {
        console.log('Authenticated user:', req.user);
        const templates = await Template.findAll({
            where: { authorId: req.user.id },
            include: [{ model: Tag }],
        });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

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
        const { id } = req.params;

        const template = await Template.findOne({
            where: { id },
            include: [
                {
                    model: Question,
                    attributes: ['id', 'text', 'type', 'isRequired', 'options'],
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                    as: 'author',
                },
            ],
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json(template);
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id/hasLiked', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const like = await Like.findOne({
            where: {
                templateId: id,
                userId: userId,
            },
        });

        res.json({ hasLiked: !!like });
    } catch (error) {
        console.error('Error checking like status:', error);
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
        console.error('Error creating template:', error);
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
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/comments', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const template = await Template.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const comment = await Comment.create({
            content,
            templateId: id,
            userId: req.user.id,
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id/comments', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const comments = await Comment.findAll({
            where: { templateId: id },
            include: [{ model: User, attributes: ['firstName', 'lastName'] }],
            order: [['createdAt', 'ASC']],
        });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/like', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const existingLike = await Like.findOne({
            where: { templateId: id, userId: req.user.id },
        });

        if (existingLike) {
            await existingLike.destroy();
            return res
                .status(200)
                .json({ message: 'Template unliked successfully' });
        }

        await Like.create({
            templateId: id,
            userId: req.user.id,
        });

        res.status(201).json({ message: 'Template liked successfully' });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id/likes', async (req, res) => {
    try {
        const { id } = req.params;

        const likesCount = await Like.count({
            where: { templateId: id },
        });

        res.json({ likesCount });
    } catch (error) {
        console.error('Error fetching likes count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:templateId/questions', auth, async (req, res) => {
    try {
        const { templateId } = req.params;
        const { text, type, isRequired, options } = req.body;

        const template = await Template.findOne({
            where: { id: templateId, authorId: req.user.id },
        });

        if (!template) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const question = await Question.create({
            templateId,
            text,
            type,
            isRequired,
            options,
        });

        res.status(201).json(question);
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:templateId/questions/:questionId', auth, async (req, res) => {
    try {
        const { templateId, questionId } = req.params;
        const { text, type, isRequired, options } = req.body;

        const template = await Template.findOne({
            where: { id: templateId, authorId: req.user.id },
        });

        if (!template) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const question = await Question.findOne({
            where: { id: questionId, templateId },
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.text = text || question.text;
        question.type = type || question.type;
        question.isRequired =
            isRequired !== undefined ? isRequired : question.isRequired;
        question.options = options || question.options;

        await question.save();

        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:templateId/questions/:questionId', auth, async (req, res) => {
    try {
        const { templateId, questionId } = req.params;

        const template = await Template.findOne({
            where: { id: templateId, authorId: req.user.id },
        });

        if (!template) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const question = await Question.findOne({
            where: { id: questionId, templateId },
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await question.destroy();

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:templateId/comments/:commentId', auth, async (req, res) => {
    try {
        const { templateId, commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findOne({
            where: { id: commentId, templateId, userId: req.user.id },
        });

        if (!comment) {
            return res
                .status(404)
                .json({ message: 'Comment not found or unauthorized' });
        }

        comment.content = content;
        await comment.save();

        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:templateId/comments/:commentId', auth, async (req, res) => {
    try {
        const { templateId, commentId } = req.params;

        const comment = await Comment.findOne({
            where: { id: commentId, templateId, userId: req.user.id },
        });

        if (!comment) {
            return res
                .status(404)
                .json({ message: 'Comment not found or unauthorized' });
        }

        await comment.destroy();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
