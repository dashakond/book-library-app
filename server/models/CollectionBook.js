const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CollectionBook = sequelize.define('collection_book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = CollectionBook;