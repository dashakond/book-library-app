const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Collection = sequelize.define('collection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Collection;