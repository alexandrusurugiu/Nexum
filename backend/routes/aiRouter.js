const express = require('express');
const router = express.Router();
const { generateAiBuild } = require('../controllers/aiController');
const { analyzeBuild } = require('../controllers/aiController');

router.post('/ai-build', generateAiBuild);
router.post('/analyze-build', analyzeBuild); 

module.exports = router;