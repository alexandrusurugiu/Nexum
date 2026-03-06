const express = require('express');
const router = express.Router();
const peripheralsController = require('../controllers/peripheralsController');

router.get('/', peripheralsController.getPeripherals);
router.post('/', peripheralsController.addPeripheral);
router.put('/:id', peripheralsController.updatePeripheral);
router.delete('/:id', peripheralsController.deletePeripheral);

module.exports = router;