const { Author } = require('../models/models');

class AuthorController {

    async createAuthor(req, res) {
        try {
            const { name } = req.body;

            const author = await Author.create({ name });

            return res.json(author);
        } catch (e) {
            return res.status(500).json({ message: "Error creating author" });
        }
    }

    async getAllAuthors(req, res) {
        try {
            const authors = await Author.findAll();
            return res.json(authors);
        } catch (e) {
            return res.status(500).json({ message: "Error fetching authors" });
        }
    }

    async getOneAuthor(req, res) {
        try {
            const { id } = req.params;

            const author = await Author.findByPk(id);

            return res.json(author);
        } catch (e) {
            return res.status(500).json({ message: "Error fetching author" });
        }
    }

    async updateAuthor(req, res) {
        try {
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

    async deleteAuthor(req, res) {
        try {
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