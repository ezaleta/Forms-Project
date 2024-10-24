'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Questions', [
            {
                templateId: 1,
                text: 'What is your name?',
                type: 'text',
                isRequired: true,
                options: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                templateId: 1,
                text: 'Tell us about yourself.',
                type: 'textarea',
                isRequired: false,
                options: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                templateId: 1,
                text: 'Select your favorite color.',
                type: 'select',
                isRequired: true,
                options: 'Red;Green;Blue;Yellow',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Questions', null, {});
    },
};
