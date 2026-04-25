const { Wishlist } = require('../models/models');

class WishlistController {

    async add(req, res) {
        try {
            const wishlist = await Wishlist.create({
                userId: req.user.id,
                ...req.body
            });

            return res.json(wishlist);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getMy(req, res) {
        try {
            const list = await Wishlist.findAll({
                where: { userId: req.user.id }
            });

            return res.json(list);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;

            const item = await Wishlist.findOne({
                where: { id, userId: req.user.id }
            });

            if (!item) {
                return res.status(404).json({ message: "Not found" });
            }

            await item.destroy();

            return res.json({ message: "Deleted" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;

            const item = await Wishlist.findOne({
                where: { id, userId: req.user.id }
            });

            if (!item) {
                return res.status(404).json({ message: "Not found" });
            }

            await item.update(req.body);

            return res.json(item);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new WishlistController();