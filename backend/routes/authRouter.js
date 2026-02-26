const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sync', authController.syncUser);
router.put('/:userId/update', authController.updateProfile);
router.put('/:userId/toggle-2fa', authController.toggle2FA);
router.post('/send-2fa', authController.send2FACode);
router.post('/verify-2fa', authController.verify2FACode);

module.exports = router;