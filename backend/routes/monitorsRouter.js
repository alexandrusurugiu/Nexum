const express = require('express');
const router = express.Router();
const monitorsController = require('../controllers/monitorsController');

router.get('/', monitorsController.getMonitors);

module.exports = router;