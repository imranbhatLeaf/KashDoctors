const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');

dotenv.config();

const patients = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'patient',
    phone: '+91 98765 43210',
    dob: '1990-05-15',
    gender: 'Male',
    address: 'Srinagar, Jammu & Kashmir'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'patient',
    phone: '+91 87654 32109',
    dob: '1995-10-20',
    gender: 'Female',
    address: 'Baramulla, Jammu & Kashmir'
  }
];

const seedPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding patients...');

    // Delete existing patients to avoid duplicates (optional)
    await Patient.deleteMany({ role: 'patient' });
    console.log('Existing patients removed.');

    // Insert new patients
    await Patient.create(patients);
    console.log(`${patients.length} patients seeded successfully!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding patients:', error.message);
    process.exit(1);
  }
};

seedPatients();
