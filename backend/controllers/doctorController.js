const Doctor = require('../models/Doctor');
const cloudinary = require('cloudinary').v2;

// @desc    Upload image to Cloudinary
// @route   POST /api/doctors/upload-image
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Convert buffer to base64 string
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Simple upload
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'doctor_profiles',
    });

    res.status(200).json({
      success: true,
      data: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all doctors (approved only)
// @route   GET /api/doctors/all
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: 'doctor', status: 'approved' });
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all doctors for admin
// @route   GET /api/doctors/admin/all
// @access  Private (Admin)
exports.getAdminDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: 'doctor' });
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update doctor status (approve/disapprove)
// @route   PUT /api/doctors/admin/status/:id
// @access  Private (Admin)
exports.updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/admin/:id
// @access  Private (Admin)
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
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
      image: req.body.image,
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
