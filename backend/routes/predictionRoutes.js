const express = require('express');
<<<<<<< HEAD
const { getPrediction, getSymptoms, chat } = require('../controllers/predictionController');
=======
const { getPrediction, getSymptoms } = require('../controllers/predictionController');
>>>>>>> origin/main
const { protect } = require('../middleware/auth');

const router = express.Router();

// You can add 'protect' middleware here if you want only registered users to use the AI
router.post('/', getPrediction);
router.get('/symptoms', getSymptoms);
<<<<<<< HEAD
router.post('/chat', chat);
=======
>>>>>>> origin/main

module.exports = router;
