const Router = require('express');
const router = new Router();

const genreController = require('../controllers/genreController')

// створити жанр
router.post('/', genreController.createGenre)

// отримати всі жанри
router.get('/', genreController.getAllGenres)

// отримати один жанр
router.get('/:id', genreController.getOneGenre)

//  оновити жанр
router.put('/:id', genreController.updateGenre)

//  видалити жан
router.delete('/:id', genreController.deleteGenre)

module.exports = router;