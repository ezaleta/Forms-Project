'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {
        static associate(models) {
            Answer.belongsTo(models.Form, { foreignKey: 'formId' });
            Answer.belongsTo(models.Question, { foreignKey: 'questionId' });
        }
    }
    Answer.init(
        {
            formId: DataTypes.INTEGER,
            questionId: DataTypes.INTEGER,
            value: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Answer',
        }
    );
    return Answer;
};
