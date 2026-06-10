const express = require('express');
const { getPrediction, getSymptoms } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// You can add 'protect' middleware here if you want only registered users to use the AI
router.post('/', getPrediction);
router.get('/symptoms', getSymptoms);

module.exports = router;
