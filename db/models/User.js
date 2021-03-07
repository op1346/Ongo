'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    emailAddress: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    isAdmin: {
      type: Sequelize.BOOLEAN
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Task, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return User;
}