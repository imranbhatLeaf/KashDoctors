const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    slotDate: {
      type: String, // Format: DD_MM_YYYY
      required: true,
    },
    slotTime: {
      type: String, // Format: HH:MM
      required: true,
    },
    userData: {
      type: Object, // Copy of patient data at time of booking
      required: true,
    },
    docData: {
      type: Object, // Copy of doctor data at time of booking
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['pay_on_visit', 'online'],
      default: 'pay_on_visit',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
