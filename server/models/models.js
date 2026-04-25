const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Genre = require('./Genre');
const ReadingSession = require('./ReadingSession');
const Review = require('./Review');
const Collection = require('./Collection')
const CollectionBook = require('./CollectionBook')
const Wishlist = require('./Wishlist')
const Goal = require('./Goal')

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

// 👤 USER → COLLECTIONS
User.hasMany(Collection, {
    foreignKey: 'userId'
});
Collection.belongsTo(User, {
    foreignKey: 'userId'
});

// 📚 COLLECTION ↔ BOOK (M:N)
Collection.belongsToMany(Book, {
    through: CollectionBook,
    foreignKey: 'collectionId',
    as: 'books'
});

Book.belongsToMany(Collection, {
    through: CollectionBook,
    foreignKey: 'bookId',
    as: 'collections'
});
User.hasMany(Wishlist, {
    foreignKey: 'userId'
});
Wishlist.belongsTo(User, {
    foreignKey: 'userId'
});
User.hasMany(Goal, {
    foreignKey: 'userId'
});
Goal.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    User,
    Book,
    Author,
    Genre,
    ReadingSession,
    Review,
    Collection,
    CollectionBook,
    Wishlist,
    Goal
};