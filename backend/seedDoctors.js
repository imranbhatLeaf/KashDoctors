const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const doctors = [
  // Cardiologist
  { name: 'Dr. Sarah Mitchell', email: 'sarah.mitchell@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Cardiologist', experience: 12, fees: 150, isPopular: true },
  { name: 'Dr. Anthony Rossi', email: 'anthony.rossi@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Cardiologist', experience: 18, fees: 220 },
  { name: 'Dr. Julia Chen', email: 'julia.chen@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Cardiologist', experience: 10, fees: 170 },
  
  // Neurologist
  { name: 'Dr. James Wilson', email: 'james.wilson@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Neurologist', experience: 15, fees: 200, isPopular: true },
  { name: 'Dr. Michael Chang', email: 'michael.chang@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Neurologist', experience: 22, fees: 280 },
  { name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Neurologist', experience: 9, fees: 190 },
  
  // Pediatrician
  { name: 'Dr. Elena Rodriguez', email: 'elena.rodriguez@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Pediatrician', experience: 8, fees: 120, isPopular: true },
  { name: 'Dr. William Thompson', email: 'william.thompson@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Pediatrician', experience: 14, fees: 140 },
  { name: 'Dr. Emily White', email: 'emily.white@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Pediatrician', experience: 6, fees: 110 },
  
  // Orthopedic
  { name: 'Dr. David Chen', email: 'david.chen@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Orthopedic', experience: 10, fees: 180 },
  { name: 'Dr. Robert Miller', email: 'robert.miller@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Orthopedic', experience: 25, fees: 300 },
  { name: 'Dr. Jessica Taylor', email: 'jessica.taylor@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Orthopedic', experience: 12, fees: 200 },
  
  // Dermatologist
  { name: 'Dr. Amara Okafor', email: 'amara.okafor@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dermatologist', experience: 7, fees: 130 },
  { name: 'Dr. Christopher Lee', email: 'christopher.lee@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dermatologist', experience: 15, fees: 180 },
  { name: 'Dr. Sophia Martinez', email: 'sophia.martinez@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dermatologist', experience: 11, fees: 150 },
  
  // General Physician
  { name: 'Dr. Thomas Müller', email: 'thomas.mueller@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'General Physician', experience: 20, fees: 100 },
  { name: 'Dr. Laura Benson', email: 'laura.benson@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'General Physician', experience: 12, fees: 90 },
  { name: 'Dr. Ahmed Hassan', email: 'ahmed.hassan@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'General Physician', experience: 16, fees: 110 },
  
  // Ophthalmology
  { name: 'Dr. Lisa Wang', email: 'lisa.wang@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Ophthalmologist', experience: 11, fees: 160 },
  { name: 'Dr. Steven Wright', email: 'steven.wright@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Ophthalmologist', experience: 19, fees: 210 },
  { name: 'Dr. Karen Scott', email: 'karen.scott@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Ophthalmologist', experience: 8, fees: 150 },
  
  // Psychiatry
  { name: 'Dr. Robert Sullivan', email: 'robert.sullivan@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Psychiatrist', experience: 14, fees: 190 },
  { name: 'Dr. Patricia Moore', email: 'patricia.moore@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Psychiatrist', experience: 21, fees: 240 },
  { name: 'Dr. Daniel Kim', email: 'daniel.kim@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Psychiatrist', experience: 10, fees: 170 },
  
  // Gynecology
  { name: 'Dr. Maria Garcia', email: 'maria.garcia@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Gynecologist', experience: 9, fees: 140 },
  { name: 'Dr. Jennifer Adams', email: 'jennifer.adams@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Gynecologist', experience: 17, fees: 180 },
  { name: 'Dr. Linda Johnson', email: 'linda.johnson@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Gynecologist', experience: 13, fees: 160 },
  
  // Oncology
  { name: 'Dr. Sanjay Gupta', email: 'sanjay.gupta@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Oncologist', experience: 18, fees: 250 },
  { name: 'Dr. Richard Davis', email: 'richard.davis@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Oncologist', experience: 24, fees: 320 },
  { name: 'Dr. Susan Peters', email: 'susan.peters@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Oncologist', experience: 14, fees: 220 },
  
  // Endocrinology
  { name: 'Dr. Sophie Dubois', email: 'sophie.dubois@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Endocrinologist', experience: 6, fees: 150 },
  { name: 'Dr. Mark Wilson', email: 'mark.wilson@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Endocrinologist', experience: 20, fees: 230 },
  { name: 'Dr. Nancy Reed', email: 'nancy.reed@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Endocrinologist', experience: 11, fees: 180 },
  
  // Dentist
  { name: 'Dr. Kevin Park', email: 'kevin.park@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dentist', experience: 5, fees: 90 },
  { name: 'Dr. Barbara Young', email: 'barbara.young@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dentist', experience: 14, fees: 120 },
  { name: 'Dr. George Harris', email: 'george.harris@kashdoc.com', password: 'password123', role: 'doctor', specialization: 'Dentist', experience: 10, fees: 100 },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Delete existing doctors to avoid duplicates
    await Doctor.deleteMany({ role: 'doctor' });
    console.log('Existing doctors removed.');

    // Insert new doctors
    await Doctor.create(doctors);
    console.log(`${doctors.length} doctors seeded successfully!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding doctors:', error.message);
    process.exit(1);
  }
};

seedDoctors();
