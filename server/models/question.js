'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(models.Template, {
                foreignKey: 'templateId',
                onDelete: 'CASCADE',
            });
            Question.hasMany(models.FormAnswer, {
                foreignKey: 'questionId',
                onDelete: 'CASCADE',
            });
        }
    }
    Question.init(
        {
            templateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            text: DataTypes.STRING,
            type: DataTypes.STRING,
            isRequired: DataTypes.BOOLEAN,
            options: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Question',
        }
    );
    return Question;
};
