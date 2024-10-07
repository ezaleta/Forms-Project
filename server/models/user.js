'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    }
    User.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: DataTypes.STRING,
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
