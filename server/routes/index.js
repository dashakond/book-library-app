const Router = require('express')
const router = new Router()

const authorRouter = require('./authorRouter')
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')
const genreRouter = require('./genreRouter')
const readingSessionRouter = require('./readingSessionRouter')
const reviewRouter = require('./reviewRouter');
const collectionRouter = require('./collectionRouter');


router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/author', authorRouter)
router.use('/genre', genreRouter)
router.use('/sessions', readingSessionRouter);
router.use('/reviews', reviewRouter);
router.use('/collections', collectionRouter);

module.exports = router