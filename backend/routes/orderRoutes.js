const express = require('express');
const router = express.Router();
const { createOrder, verifyOrder, getOrderHistory, getPendingOrders, getDeliverOrders, getOrderOtp, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyOrder);
router.get('/history', protect, getOrderHistory);
router.get('/pending', protect, getPendingOrders);
router.get('/deliver', protect, getDeliverOrders);
router.get('/allorders', protect, getAllOrders);

module.exports = router;