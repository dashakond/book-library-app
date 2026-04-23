const Router = require('express')
const router = new Router()

const authorRouter = require('./authorRouter')
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')
const genreRouter = require('./genreRouter')
const readingSessionRouter = require('./readingSessionRouter')



router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/author', authorRouter)
router.use('/genre', genreRouter)
router.use('/sessions', readingSessionRouter);

module.exports = router