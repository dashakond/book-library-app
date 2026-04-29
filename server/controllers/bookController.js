const { Book, Author, Genre, ReadingSession, Goal } = require('../models/models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
class BookController {

    async createBook(req, res) {
        try {
            const {
                title,
                description,
                shelf,
                pages,
                userId
            } = req.body;

            // 🔥 ДОДАЙ ОЦЕ
            const authorName = req.body.authorName || req.body.author;
            const genreName = req.body.genreName || req.body.genre;
            let fileName = null;

            // 📌 image upload (як у тебе вже є)
            if (req.files && req.files.image) {
                const file = req.files.image;
                fileName = uuidv4() + path.extname(file.name);

                const uploadPath = path.resolve(
                    __dirname,
                    '..',
                    'static',
                    fileName
                );

                await file.mv(uploadPath);
            }

            // 🔥 1. FIND OR CREATE AUTHOR
            let author = await Author.findOne({ where: { name: authorName } });

            if (!author) {
                author = await Author.create({ name: authorName });
            }

            // 🔥 2. FIND OR CREATE GENRE
            let genre = await Genre.findOne({ where: { name: genreName } });

            if (!genre) {
                genre = await Genre.create({ name: genreName });
            }

            // 📚 3. CREATE BOOK
            const book = await Book.create({
                title,
                description,
                authorId: author.id,
                genreId: genre.id,
                shelf,
                userId: req.user.id,
                image_url: fileName,
                pages
            });

            return res.json(book);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e.message });
        }
    }

    async getAllBooks(req, res) {
        try {
            const { role, id } = req.user;

            let books;

            if (role === 'ADMIN') {
                books = await Book.findAll({
                    include: [Author, Genre]
                });
            } else {
                books = await Book.findAll({
                    where: { userId: id },
                    include: [Author, Genre]
                });
            }

            // 🔥 ABANDONED LOGIC (30 days)
            for (let book of books) {

                if (book.status === "finished") continue;

                const lastSession = await ReadingSession.findOne({
                    where: {
                        bookId: book.id,
                        userId: id
                    },
                    order: [
                        ["endTime", "DESC"]
                    ]
                });

                if (!lastSession || !lastSession.endTime) continue;

                const daysDiff =
                    (Date.now() - new Date(lastSession.endTime)) /
                    (1000 * 60 * 60 * 24);

                if (daysDiff > 30) {
                    await book.update({ status: "abandoned" });
                    book.status = "abandoned"; // щоб одразу відобразилось у UI
                }
            }

            return res.json(books);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching books" });
        }
    }

    async getOneBook(req, res) {
        try {
            const { role, id: userId } = req.user;
            const bookId = req.params.id;

            const where = role === 'ADMIN' ? { id: bookId } : { id: bookId, userId };

            const book = await Book.findOne({
                where,
                include: [Author, Genre]
            });

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            return res.json(book);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching book" });
        }
    }

    async updateBook(req, res) {
        try {
            const { role, id: userId } = req.user;

            const book = await Book.findOne({
                where: role === 'ADMIN' ? { id: req.params.id } : { id: req.params.id, userId }
            });

            if (!book) {
                return res.status(403).json({ message: "No access or not found" });
            }

            await book.update(req.body);

            return res.json(book);

        } catch (e) {
            return res.status(500).json({ message: "Error updating book" });
        }
    }

    async deleteBook(req, res) {
        try {
            const { role, id: userId } = req.user;

            const book = await Book.findOne({
                where: role === 'ADMIN' ? { id: req.params.id } : { id: req.params.id, userId }
            });

            if (!book) {
                return res.status(403).json({ message: "No access or not found" });
            }

            await book.destroy();

            return res.json({ message: "Book deleted" });

        } catch (e) {
            return res.status(500).json({ message: "Error deleting book" });
        }
    }
    async finishBook(req, res) {
        try {
            const userId = req.user.id;
            const { bookId } = req.body;

            const book = await Book.findOne({
                where: { id: bookId, userId }
            });

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            // 🔥 1. ставимо finished
            await book.update({ status: "finished" });

            // 🔥 2. оновлюємо goals
            const goals = await Goal.findAll({
                where: { userId }
            });

            const now = new Date();

            for (let goal of goals) {

                // ⛔ тільки активні
                if (new Date(goal.endDate) < now) continue;

                goal.currentCount += 1;
                await goal.save();
            }

            return res.json({ message: "Book finished + goals updated" });

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new BookController();