const Router = require('express');
const router = new Router();

const readingSessionController = require('../controllers/readingSessionController');
const auth = require('../middleware/authMiddleware');

// 🔐 всі через auth
router.post('/start', auth, readingSessionController.startSession);
router.post('/end', auth, readingSessionController.endActiveSession);;
router.get('/', auth, readingSessionController.getMySessions);

module.exports = router;