const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');

router.post('/gemini', chat); // Ensure the route is correct

module.exports = router;