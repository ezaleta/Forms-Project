const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    },
    test: {},
    production: {
        use_env_variable: 'process.env.DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
