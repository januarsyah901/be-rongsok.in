const express = require('express');
const router = express.Router();
const { submitRating, getUserRatings } = require('../controllers/rating');
const { protect } = require('../middlewares/auth');

router.post('/', protect, submitRating);
router.get('/user/:userId', protect, getUserRatings);

module.exports = router;
