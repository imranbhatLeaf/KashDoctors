const express = require('express');
const { getPrediction, getSymptoms, chat } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// You can add 'protect' middleware here if you want only registered users to use the AI
router.post('/', getPrediction);
router.get('/symptoms', getSymptoms);
// AI Assistant chat is restricted to signed-in users only
router.post('/chat', protect, chat);

module.exports = router;
