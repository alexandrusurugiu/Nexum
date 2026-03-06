const express = require('express');
const router = express.Router();
const monitorsController = require('../controllers/monitorsController');

router.get('/', monitorsController.getMonitors);
router.post('/', monitorsController.addMonitor);
router.put('/:id', monitorsController.updateMonitor);
router.delete('/:id', monitorsController.deleteMonitor);

module.exports = router;