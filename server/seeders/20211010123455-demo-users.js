'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const usersData = [
            {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice@example.com',
                password: await bcrypt.hash('Password123!', 10),
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob@example.com',
                password: await bcrypt.hash('SecurePass456!', 10),
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Carol',
                lastName: 'Williams',
                email: 'carol@example.com',
                password: await bcrypt.hash('MyPass789!', 10),
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'David',
                lastName: 'Brown',
                email: 'david@example.com',
                password: await bcrypt.hash('DavidPass321!', 10),
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Eve',
                lastName: 'Davis',
                email: 'eve@example.com',
                password: await bcrypt.hash('EveSecure654!', 10),
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('Users', usersData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    },
};
