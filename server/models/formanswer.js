'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FormAnswer extends Model {
        static associate(models) {
            FormAnswer.belongsTo(models.Form, {
                foreignKey: 'formId',
                onDelete: 'CASCADE',
            });
            FormAnswer.belongsTo(models.Question, { foreignKey: 'questionId' });
        }
    }
    FormAnswer.init(
        {
            formId: DataTypes.INTEGER,
            questionId: DataTypes.INTEGER,
            answer: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'FormAnswer',
        }
    );
    return FormAnswer;
};
