'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Form extends Model {
        static associate(models) {
            Form.belongsTo(models.User, { foreignKey: 'userId' });
            Form.belongsTo(models.Template, { foreignKey: 'templateId' });
            Form.hasMany(models.Answer, { foreignKey: 'formId' });
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
