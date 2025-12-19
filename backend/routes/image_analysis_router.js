// routes/imageAnalysis.js
const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/scam_convo_detectorController');

// Single endpoint for image analysis
router.post('/analyze', analyzeImage);

module.exports = router;