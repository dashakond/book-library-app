const { Book, Author, Genre } = require('../models/models');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
class BookController {

    async createBook(req, res) {
        try {
            const {
                title,
                description,
                shelf,
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
                userId,
                image_url: fileName
            });

            return res.json(book);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e.message });
        }
    }

    async getAllBooks(req, res) {
        try {
            const books = await Book.findAll({
                include: [Author, Genre]
            });

            return res.json(books);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching books" });
        }
    }

    async getOneBook(req, res) {
        try {
            const { id } = req.params;

            const book = await Book.findByPk(id, {
                include: [Author, Genre]
            });

            return res.json(book);
        } catch (e) {
            return res.status(500).json({ message: "Error fetching book" });
        }
    }

    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const book = await Book.findByPk(id);

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            await book.update(data);

            return res.json(book);
        } catch (e) {
            return res.status(500).json({ message: "Error updating book" });
        }
    }

    async deleteBook(req, res) {
        try {
            const { id } = req.params;

            const book = await Book.findByPk(id);

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            await book.destroy();

            return res.json({ message: "Book deleted" });
        } catch (e) {
            return res.status(500).json({ message: "Error deleting book" });
        }
    }
}

module.exports = new BookController();