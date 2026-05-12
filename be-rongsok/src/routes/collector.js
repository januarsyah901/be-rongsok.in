const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, updateCatalogs, getProfile } = require('../controllers/collector');
const { protect } = require('../middlewares/auth');

router.get('/profile', protect, getProfile);
router.post('/profile', protect, createOrUpdateProfile);
router.patch('/profile', protect, createOrUpdateProfile);
router.patch('/catalogs', protect, updateCatalogs);

module.exports = router;
