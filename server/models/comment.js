'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Template, { foreignKey: 'templateId' });
            Comment.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Comment.init(
        {
            content: DataTypes.TEXT,
            templateId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Comment',
        }
    );
    return Comment;
};
