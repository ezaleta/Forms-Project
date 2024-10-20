'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(models.Template, { foreignKey: 'templateId' });
            Question.hasMany(models.Answer, { foreignKey: 'questionId' });
        }
    }
    Question.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            type: DataTypes.STRING,
            isInResultsTable: DataTypes.BOOLEAN,
            order: DataTypes.INTEGER,
            templateId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Question',
        }
    );
    return Question;
};
