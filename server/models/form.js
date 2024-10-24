'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Form extends Model {
        static associate(models) {
            Form.belongsTo(models.User, { foreignKey: 'userId' });
            Form.belongsTo(models.Template, { foreignKey: 'templateId' });
            Form.hasMany(models.FormAnswer, {
                foreignKey: 'formId',
                onDelete: 'CASCADE',
            });
        }
    }
    Form.init(
        {
            userId: DataTypes.INTEGER,
            templateId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Form',
        }
    );
    return Form;
};
