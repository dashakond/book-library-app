const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Book = sequelize.define('book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT
    },

    shelf: {
        type: DataTypes.STRING
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'not_read'
            // not_read | reading | finished | abandoned
    },
    image_url: { type: DataTypes.TEXT },
}, {
    tableName: 'books',
    timestamps: true
});

module.exports = Book;