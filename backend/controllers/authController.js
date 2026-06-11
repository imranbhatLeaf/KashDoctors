const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, certificationNo, specialization, experience, fees, about } = req.body;
    console.log(`Registration attempt: ${email}, role: ${role}`);

    // Check if user already exists in either collection
    const patientExists = await Patient.findOne({ email });
    const doctorExists = await Doctor.findOne({ email });

    if (patientExists || doctorExists) {
      console.log(`Registration failed: Email ${email} already exists.`);
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists' 
      });
    }

    let user;
    if (role === 'doctor') {
      console.log(`Targeting collection: ${Doctor.collection.name}`);
      user = await Doctor.create({ 
        name, 
        email, 
        password, 
        role, 
        phone, 
        certificationNo, 
        specialization, 
        experience: experience ? Number(experience) : undefined, 
        fees: fees ? Number(fees) : undefined, 
        about, 
        status: 'pending' 
      });
    } else {
      console.log(`Targeting collection: ${Patient.collection.name} in database: ${Patient.db.name}`);
      user = await Patient.create({ name, email, password, role: 'patient', phone });
    }

    console.log('Database Result:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collection: user.constructor.modelName
    });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for admin login
    if (email === 'admin' && password === 'admin') {
      const adminUser = { _id: 'admin-id', name: 'Admin', email: 'admin', role: 'admin' };
      return sendTokenResponse(adminUser, 200, res);
    }

    // Check in both collections
    let user = await Patient.findOne({ email }).select('+password');
    if (!user) {
      user = await Doctor.findOne({ email }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(200).json({ success: true, data: req.user });
    }
    let user = await Patient.findById(req.user.id);
    if (!user) {
      user = await Doctor.findById(req.user.id);
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    role: user.role,
  });
};
