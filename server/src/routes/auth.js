const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser)
            return res
                .status(400)
                .json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
