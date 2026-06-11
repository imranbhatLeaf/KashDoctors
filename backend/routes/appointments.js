const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  completeAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my-appointments', protect, authorize('patient'), getMyAppointments);
router.get('/doctor-appointments', protect, authorize('doctor'), getDoctorAppointments);
router.put('/cancel/:id', protect, cancelAppointment);
router.put('/complete/:id', protect, authorize('doctor'), completeAppointment);

module.exports = router;
