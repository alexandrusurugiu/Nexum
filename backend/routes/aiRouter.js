const express = require('express');
const router = express.Router();
const { generateAiBuild } = require('../controllers/aiController');

router.post('/ai-build', generateAiBuild);

module.exports = router;