const { Genre } = require('../models/models');

class GenreController {

    //  USER + ADMIN 
    async getAllGenres(req, res) {
        try {
            const genres = await Genre.findAll();
            return res.json(genres);
        } catch (e) {
            return res.status(500).json({ message: "Error fetching genres" });
        }
    }

    //  USER + ADMIN 
    async getOneGenre(req, res) {
        try {
            const { id } = req.params;

            const genre = await Genre.findByPk(id);

            if (!genre) {
                return res.status(404).json({ message: "Genre not found" });
            }

            return res.json(genre);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching genre" });
        }
    }

    // ADMIN ONLY
    async createGenre(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { name } = req.body;

            const genre = await Genre.create({ name });

            return res.json(genre);

        } catch (e) {
            return res.status(500).json({ message: "Error creating genre" });
        }
    }

    //  ADMIN ONLY
    async updateGenre(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { id } = req.params;
            const { name } = req.body;

            const genre = await Genre.findByPk(id);

            if (!genre) {
                return res.status(404).json({ message: "Genre not found" });
            }

            await genre.update({ name });

            return res.json(genre);

        } catch (e) {
            return res.status(500).json({ message: "Error updating genre" });
        }
    }

    // ADMIN ONLY
    async deleteGenre(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: "Only admin" });
            }

            const { id } = req.params;

            const genre = await Genre.findByPk(id);

            if (!genre) {
                return res.status(404).json({ message: "Genre not found" });
            }

            await genre.destroy();

            return res.json({ message: "Genre deleted" });

        } catch (e) {
            return res.status(500).json({ message: "Error deleting genre" });
        }
    }
}

module.exports = new GenreController();