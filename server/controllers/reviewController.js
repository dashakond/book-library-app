const { Review, User, Book } = require('../models/models');

class ReviewController {

    // ➕ CREATE REVIEW
    async createReview(req, res) {
        try {
            const { bookId, rating, comment } = req.body;

            const review = await Review.create({
                userId: req.user.id,
                bookId,
                rating,
                comment
            });

            return res.json(review);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // 📚 GET REVIEWS BY BOOK
    async getBookReviews(req, res) {
        try {
            const { bookId } = req.params;

            const reviews = await Review.findAll({
                where: { bookId },
                include: [{
                    model: User,
                    attributes: ['id', 'name']
                }]
            });

            return res.json(reviews);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching reviews" });
        }
    }

    // 👤 GET MY REVIEWS
    async getMyReviews(req, res) {
        try {
            const reviews = await Review.findAll({
                where: { userId: req.user.id },
                include: [Book]
            });

            return res.json(reviews);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching reviews" });
        }
    }

    // 🗑 DELETE REVIEW (тільки свій)
    async deleteReview(req, res) {
        try {
            const { id } = req.params;

            const review = await Review.findOne({
                where: {
                    id,
                    userId: req.user.id
                }
            });

            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            await review.destroy();

            return res.json({ message: "Review deleted" });

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new ReviewController();