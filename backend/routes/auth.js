const express = require('express');
const router = express.Router();
const { login, logout,getProfile } = require('../controllers/authController');
const { verifyGoogleToken } = require('../middleware/auth');

// Google OAuth login flow
router.post('/google-login', verifyGoogleToken, login);
router.post('/logout', logout);
router.get('/profile',getProfile);


module.exports = router;