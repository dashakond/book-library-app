const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Genre = sequelize.define('genre', {
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
    tableName: 'genres',
    timestamps: false
});

module.exports = Genre;