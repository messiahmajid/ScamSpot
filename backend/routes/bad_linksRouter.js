const express = require('express');
const router = express.Router();
const {
    getBadLinks,
    getScans,
    getStats,
    validateUrl
} = require('../controllers/bad_linksController');

router.post('/validate-url', validateUrl);
router.get('/scans', getScans);
router.get('/bad-links', getBadLinks);
router.get('/stats', getStats);

module.exports = router;
