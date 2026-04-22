const Router = require('express');
const router = new Router();
const bookController = require('../controllers/bookController')
const checkRole = require('../middleware/checkRoleMiddeleware')

router.post('/', checkRole('ADMIN'), bookController.createBook)

// отримати всі книги
router.get('/', bookController.getAllBooks)

// отримати одну книгу
router.get('/:id', bookController.getOneBook)

//  оновити книгу
router.put('/:id', bookController.updateBook)

//  видалити книгу
router.delete('/:id', bookController.deleteBook)

module.exports = router;