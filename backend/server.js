const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route files
const auth = require('./routes/auth');
const doctors = require('./routes/doctors');
const appointments = require('./routes/appointments');
const predict = require('./routes/predictionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/doctors', doctors);
app.use('/api/appointments', appointments);
app.use('/api/predict', predict);

// Basic Route
app.get('/', (req, res) => {
  res.send('Doctor Appointment API is running...');
});

// Database Connection
const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
    if (process.env.NODE_ENV !== 'test') {
      console.log('PORT value:', PORT);

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        
      });
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

connectDB();

module.exports = app;
