const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Genre = require('./Genre');
const ReadingSession = require('./ReadingSession');
const Review = require('./Review')

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
// 🔗 USER → READING_SESSIONS (1:N)
User.hasMany(ReadingSession, {
    foreignKey: 'userId'
});
ReadingSession.belongsTo(User, {
    foreignKey: 'userId'
});

// 🔗 BOOK → READING_SESSIONS (1:N)
Book.hasMany(ReadingSession, {
    foreignKey: 'bookId'
});
ReadingSession.belongsTo(Book, {
    foreignKey: 'bookId'
});

User.hasMany(Review, {
    foreignKey: 'userId'
});
Review.belongsTo(User, {
    foreignKey: 'userId'
});

Book.hasMany(Review, {
    foreignKey: 'bookId'
});
Review.belongsTo(Book, {
    foreignKey: 'bookId'
});

module.exports = {
    User,
    Book,
    Author,
    Genre,
    ReadingSession,
    Review
};