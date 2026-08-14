const express = require('express');
const { updateProgress, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/update', protect, updateProgress);
router.get('/:userId', protect, getProgress);

module.exports = router;
