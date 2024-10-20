'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TemplateTags', {
            templateId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Templates',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            tagId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Tags',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TemplateTags');
    },
};
