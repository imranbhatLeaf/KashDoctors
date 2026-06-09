const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;

    const docData = await Doctor.findById(docId);

    if (!docData) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: docId,
      slotDate,
      slotTime,
      cancelled: false,
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'Slot already booked' });
    }

    const appointmentData = {
      patient: req.user.id,
      doctor: docId,
      userData: req.user,
      docData: docData,
      amount: docData.fees || 0,
      slotTime,
      slotDate,
      paymentMethod: req.body.paymentMethod || 'pay_on_visit',
    };

    const newAppointment = await Appointment.create(appointmentData);

    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name specialization');
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name email');
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/cancel/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { cancelled: true, status: 'cancelled' },
      { new: true }
    );

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/complete/:id
// @access  Private (Doctor)
exports.completeAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true, status: 'completed' },
      { new: true }
    );

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
