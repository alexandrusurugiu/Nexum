const express = require('express');
const router = express.Router();
const laptopsController = require('../controllers/laptopsController');

router.get('/', laptopsController.getLaptops);
router.post('/', laptopsController.addLaptop);
router.put('/:id', laptopsController.updateLaptop);
router.delete('/:id', laptopsController.deleteLaptop);

module.exports = router;