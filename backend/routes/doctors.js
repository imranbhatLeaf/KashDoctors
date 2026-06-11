const express = require('express');
const { getDoctors, getDoctorById, updateProfile, getAdminDoctors, updateDoctorStatus, deleteDoctor, uploadImage } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/all', getDoctors);
router.get('/admin/all', protect, authorize('admin'), getAdminDoctors);
router.put('/admin/status/:id', protect, authorize('admin'), updateDoctorStatus);
router.delete('/admin/:id', protect, authorize('admin'), deleteDoctor);
router.get('/:id', getDoctorById);
router.put('/profile', protect, updateProfile);
router.post('/upload-image', protect, upload.single('image'), uploadImage);

module.exports = router;
