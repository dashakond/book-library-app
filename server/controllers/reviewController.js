const { Review, User, Book } = require('../models/models');
const { ReadingSession } = require('../models/models');
const { Op } = require('sequelize');

class ReviewController {

    // ➕ CREATE REVIEW
    async createReview(req, res) {
        try {
            const { bookId, rating, comment } = req.body;

            // 🔥 перевірка чи користувач завершив читання
            const session = await ReadingSession.findOne({
                where: {
                    userId: req.user.id,
                    bookId,
                    endTime: {
                        [Op.ne]: null
                    }
                }
            });
            if (!session) {
                return res.status(403).json({
                    message: "Finish reading before leaving a review"
                });
            }

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