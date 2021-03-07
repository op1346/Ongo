'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Task extends Sequelize.Model {}
  Task.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskCompleted: {
      type: Sequelize.BOOLEAN
    },
    title: {
      type: Sequelize.STRING
    }
  }, { sequelize });

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  };
  return Task;
}