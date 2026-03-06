const express = require('express');
const router = express.Router();
const componentsController = require('../controllers/componentsController');

router.get('/', componentsController.getProducts);
router.post('/', componentsController.addProduct);
router.put('/:id', componentsController.updateProduct);
router.delete('/:id', componentsController.deleteProduct);

module.exports = router;