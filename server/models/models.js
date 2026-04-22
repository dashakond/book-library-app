const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Genre = require('./Genre');

// 🔗 AUTHOR → BOOKS (1:N)
Author.hasMany(Book, {
    foreignKey: 'authorId'
});
Book.belongsTo(Author, {
    foreignKey: 'authorId'
});

// 🔗 GENRE → BOOKS (1:N)
Genre.hasMany(Book, {
    foreignKey: 'genreId'
});
Book.belongsTo(Genre, {
    foreignKey: 'genreId'
});

// 🔗 USER → BOOKS (1:N)
User.hasMany(Book, {
    foreignKey: 'userId'
});
Book.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    User,
    Book,
    Author,
    Genre
};