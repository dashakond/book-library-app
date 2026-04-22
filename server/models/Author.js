const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Author = sequelize.define('author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'authors',
    timestamps: false
});

module.exports = Author;