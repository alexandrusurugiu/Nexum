const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.post('/confirm-payment', orderController.confirmPayment);
router.get('/user/:userId', orderController.getUserOrders);

module.exports = router;