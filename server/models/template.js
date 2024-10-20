'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Template extends Model {
        static associate(models) {
            Template.belongsTo(models.User, {
                as: 'author',
                foreignKey: 'authorId',
            });
            Template.hasMany(models.Question, { foreignKey: 'templateId' });
            Template.hasMany(models.Form, { foreignKey: 'templateId' });
            Template.belongsToMany(models.Tag, {
                through: 'TemplateTags',
                foreignKey: 'templateId',
            });
        }
    }
    Template.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            topic: DataTypes.STRING,
            image: DataTypes.STRING,
            isPublic: DataTypes.BOOLEAN,
            authorId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Template',
        }
    );
    return Template;
};