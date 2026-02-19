const express = require('express');
const router = express.Router();
const peripheralsController = require('../controllers/peripheralsController');

router.get('/', peripheralsController.getPeripherals);


module.exports = router;