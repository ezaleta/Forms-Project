'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            Like.belongsTo(models.Template, { foreignKey: 'templateId' });
            Like.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Like.init(
        {
            templateId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Like',
        }
    );
    return Like;
};
