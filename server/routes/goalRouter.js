const Router = require('express');
const router = new Router();

const controller = require('../controllers/goalController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.create);
router.get('/', auth, controller.getMy);
router.put('/:id/progress', auth, controller.updateProgress);
router.delete('/:id', auth, controller.remove);

module.exports = router;