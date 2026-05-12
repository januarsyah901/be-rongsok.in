const express = require('express');
const router = express.Router();
const { search, getCategories } = require('../controllers/discovery');
const { protect } = require('../middlewares/auth');

router.get('/search', protect, search);
router.get('/categories', getCategories);

module.exports = router;
