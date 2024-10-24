'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('FormAnswers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            formId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Forms',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            questionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Questions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            answer: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('FormAnswers');
    },
};
