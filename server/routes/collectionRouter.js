const Router = require('express');
const router = new Router();

const controller = require('../controllers/collectionController');
const auth = require('../middleware/authMiddleware');

// ➕ create collection
router.post('/', auth, controller.createCollection);

// 📚 get my collections
router.get('/', auth, controller.getMyCollections);

// ➕ add book
router.post('/add-book', auth, controller.addBook);

// ❌ remove book
router.delete('/:collectionId/books/:bookId', auth, controller.removeBook);

// 🗑 delete collection
router.delete('/:id', auth, controller.deleteCollection);

module.exports = router;