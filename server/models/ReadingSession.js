const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ReadingSession = sequelize.define('reading_session', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    startPage: DataTypes.INTEGER,
    endPage: DataTypes.INTEGER,

    startTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    endTime: DataTypes.DATE,

    durationMinutes: DataTypes.INTEGER,

    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
});

module.exports = ReadingSession;