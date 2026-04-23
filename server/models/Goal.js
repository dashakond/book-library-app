const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Goal = sequelize.define('goal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    type: {
        type: DataTypes.STRING, // week / month / year
        allowNull: false
    },

    targetCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    currentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    startDate: {
        type: DataTypes.DATE
    },

    endDate: {
        type: DataTypes.DATE
    }
});
module.exports = Goal;