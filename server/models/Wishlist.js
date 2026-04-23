const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Wishlist = sequelize.define('wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    author: {
        type: DataTypes.STRING
    },

    price: {
        type: DataTypes.DECIMAL(10, 2)
    },

    currency: {
        type: DataTypes.STRING,
        defaultValue: 'UAH'
    },

    link: {
        type: DataTypes.TEXT
    },

    note: {
        type: DataTypes.TEXT
    },

    isBought: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Wishlist;