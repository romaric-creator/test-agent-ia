'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This file contains all your models definitions which
     * will then receive the Sequelize object as parameter.
     */
    static associate(models) {
      // define association here
    }
  }
  Conversation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'Conversations',
    timestamps: true
  });
  return Conversation;
};
