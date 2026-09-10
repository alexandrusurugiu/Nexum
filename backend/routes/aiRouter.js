const express = require('express');
const router = express.Router();
const { generateAiBuild } = require('../controllers/aiController');
const { analyzeBuild } = require('../controllers/aiController');
const { upgradePcBuild } = require('../controllers/aiController'); 

router.post('/ai-build', generateAiBuild);
router.post('/analyze-build', analyzeBuild); 
router.post('/upgrade-pc', upgradePcBuild);

module.exports = router;