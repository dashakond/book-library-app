const Router = require('express');
const router = new Router();

const controller = require('../controllers/wishlistController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.add);
router.get('/', auth, controller.getMy);
router.delete('/:id', auth, controller.remove);

module.exports = router;