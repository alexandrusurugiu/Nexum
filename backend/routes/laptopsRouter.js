const express = require('express');
const router = express.Router();
const laptopsController = require('../controllers/laptopsController');

router.get('/', laptopsController.getLaptops);


module.exports = router;