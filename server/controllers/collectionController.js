const { Collection, Book } = require('../models/models');

class CollectionController {

    // ➕ CREATE COLLECTION
    async createCollection(req, res) {
        try {
            const { name } = req.body;

            const collection = await Collection.create({
                userId: req.user.id,
                name
            });

            return res.json(collection);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // 📚 GET MY COLLECTIONS
    async getMyCollections(req, res) {
        try {
            const collections = await Collection.findAll({
                where: { userId: req.user.id },
                include: [Book]
            });

            return res.json(collections);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching collections" });
        }
    }

    // ➕ ADD BOOK TO COLLECTION
    async addBook(req, res) {
        try {
            const { collectionId, bookId } = req.body;

            const collection = await Collection.findOne({
                where: {
                    id: collectionId,
                    userId: req.user.id
                }
            });

            if (!collection) {
                return res.status(404).json({ message: "Collection not found" });
            }

            await collection.addBook(bookId);

            return res.json({ message: "Book added to collection" });

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // ❌ REMOVE BOOK FROM COLLECTION
    async removeBook(req, res) {
        try {
            const { collectionId, bookId } = req.body;

            const collection = await Collection.findOne({
                where: {
                    id: collectionId,
                    userId: req.user.id
                }
            });

            if (!collection) {
                return res.status(404).json({ message: "Collection not found" });
            }

            await collection.removeBook(bookId);

            return res.json({ message: "Book removed" });

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // 🗑 DELETE COLLECTION
    async deleteCollection(req, res) {
        try {
            const { id } = req.params;

            const collection = await Collection.findOne({
                where: {
                    id,
                    userId: req.user.id
                }
            });

            if (!collection) {
                return res.status(404).json({ message: "Collection not found" });
            }

            await collection.destroy();

            return res.json({ message: "Collection deleted" });

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new CollectionController();