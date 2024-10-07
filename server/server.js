const express = require('express');
const app = express();
const { sequelize } = require('./models');
const authRoutes = require('./src/routes/auth');
const protectedRoutes = require('./src/routes/protected');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send('Error connecting to the database');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/protected', protectedRoutes);
