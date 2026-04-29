const Router = require('express');
const router = new Router();
const bookController = require('../controllers/bookController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, bookController.createBook);

// отримати всі книги
router.get('/', authMiddleware, bookController.getAllBooks)

// отримати одну книгу
router.get('/:id', authMiddleware, bookController.getOneBook)

//  оновити книгу
router.put('/:id', authMiddleware, bookController.updateBook)

//  видалити книгу
router.delete('/:id', authMiddleware, bookController.deleteBook)

router.post('/finish', authMiddleware, bookController.finishBook)

module.exports = router;