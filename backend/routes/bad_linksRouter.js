const express = require('express');
const router = express.Router();
const { validateUrl } = require('../controllers/bad_linksController');
const {isLoggedIn} = require('../middleware/auth');
// Optionally add authentication middleware if needed, for example:
// const { verifySession } = require('../middleware/auth');

// Validate URLs endpoint
// If you use session or other auth middleware, add it as a parameter.
// e.g., router.post('/validate-url', verifySession, validateUrl);
router.post('/validate-url',validateUrl);

module.exports = router;
