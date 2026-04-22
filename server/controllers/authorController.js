const { Author } = require('../models/models');

class AuthorController {

    //  USER + ADMIN
    async getAllAuthors(req, res) {
        try {
            const authors = await Author.findAll();
            return res.json(authors);
        } catch (e) {
            return res.status(500).json({ message: "Error fetching authors" });
        }
    }

    //  USER + ADMIN
    async getOneAuthor(req, res) {
        try {
            const { id } = req.params;

            const author = await Author.findByPk(id);

            if (!author) {
                return res.status(404).json({ message: "Author not found" });
            }

            return res.json(author);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching author" });
        }
    }

    //  ADMIN ONLY
    async createAuthor(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { name } = req.body;

            const author = await Author.create({ name });

            return res.json(author);

        } catch (e) {
            return res.status(500).json({ message: "Error creating author" });
        }
    }

    //  ADMIN ONLY
    async updateAuthor(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { id } = req.params;
            const { name } = req.body;

            const author = await Author.findByPk(id);

            if (!author) {
                return res.status(404).json({ message: "Author not found" });
            }

            await author.update({ name });

            return res.json(author);

        } catch (e) {
            return res.status(500).json({ message: "Error updating author" });
        }
    }

    //  ADMIN ONLY
    async deleteAuthor(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { id } = req.params;

            const author = await Author.findByPk(id);

            if (!author) {
                return res.status(404).json({ message: "Author not found" });
            }

            await author.destroy();

            return res.json({ message: "Author deleted" });

        } catch (e) {
            return res.status(500).json({ message: "Error deleting author" });
        }
    }
}

module.exports = new AuthorController();