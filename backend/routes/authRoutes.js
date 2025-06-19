const express = require('express');
const router = express.Router();
const { register, login, updateProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const verifyRecaptcha = require('../middleware/recaptcha');

// Add verifyRecaptcha middleware to both register and login routes
router.post('/register', verifyRecaptcha, register);
router.post('/login', verifyRecaptcha, login);
router.put('/profile', protect, updateProfile);
router.get('/profile', protect, getProfile);

module.exports = router;