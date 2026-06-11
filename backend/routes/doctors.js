const express = require('express');
const { getDoctors, getDoctorById, updateProfile } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/all', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, updateProfile);

module.exports = router;
