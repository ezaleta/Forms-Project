const express = require('express');
const cors = require('cors'); // Import cors
const helmet = require('helmet'); // Import helmet
const morgan = require('morgan'); // Import morgan
const app = express();
const { sequelize } = require('./models');
const authRoutes = require('./src/routes/auth');
const protectedRoutes = require('./src/routes/protected');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173'];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (e.g., mobile apps, curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    'The CORS policy does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);
app.use(helmet()); // Use helmet middleware for security
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

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
