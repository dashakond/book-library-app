const Router = require('express');
const router = new Router();
const authorController = require('../controllers/authorController')

// створити автора
router.post('/', authorController.createAuthor)

router.get('/', authorController.getAllAuthors)

//отримати одного автора
router.get('/:id', authorController.getOneAuthor)

//оновити автора
router.put('/:id', authorController.updateAuthor)

// видалити автора
router.delete('/:id', authorController.deleteAuthor)

module.exports = router;