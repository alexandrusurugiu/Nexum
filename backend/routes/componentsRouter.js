const express = require('express');
const router = express.Router();
const componentsController = require('../controllers/componentsController');

router.get('/', componentsController.getProducts);


module.exports = router;