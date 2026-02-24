const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sync', authController.syncUser);
router.put('/:userId/update', authController.updateProfile);

module.exports = router;