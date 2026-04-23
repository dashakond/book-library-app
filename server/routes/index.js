const Router = require('express')
const router = new Router()

const authorRouter = require('./authorRouter')
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')
const genreRouter = require('./genreRouter')
const readingSessionRouter = require('./readingSessionRouter')
const reviewRouter = require('./reviewRouter');
const collectionRouter = require('./collectionRouter');
const wishlistController = require('./wishlistRouter');
const goalController = require('./goalRouter');


router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/author', authorRouter)
router.use('/genre', genreRouter)
router.use('/sessions', readingSessionRouter);
router.use('/reviews', reviewRouter);
router.use('/wishlist', wishlistController);
router.use('/collections', collectionRouter);
router.use('/goals', goalController);

module.exports = router