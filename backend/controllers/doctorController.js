const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors/all
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: 'doctor' });
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/doctors/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      about: req.body.about,
      specialization: req.body.specialization,
      experience: req.body.experience,
      fees: req.body.fees,
      certificationNo: req.body.certificationNo,
    };

    const user = await Doctor.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
