const Router = require('express');
const router = new Router();

const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// ➕ створити відгук
router.post('/', auth, reviewController.createReview);

// 📚 відгуки книги
router.get('/book/:bookId', reviewController.getBookReviews);

// 👤 мої відгуки
router.get('/me', auth, reviewController.getMyReviews);

// 🗑 видалити свій відгук
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;