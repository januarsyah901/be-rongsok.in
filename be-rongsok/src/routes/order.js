const express = require('express');
const router = express.Router();
const { createOrder, updateStatus, getOrderDetails } = require('../controllers/order');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderDetails);
router.patch('/:id', protect, updateStatus);

module.exports = router;
