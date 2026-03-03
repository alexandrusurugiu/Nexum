const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminPanelController');

router.post('/product', adminController.addProduct);
router.put('/product/:id', adminController.updateProduct);
router.delete('/product/:id', adminController.deleteProduct);

module.exports = router;