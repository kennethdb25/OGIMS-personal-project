const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  requestorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  appointmentStatus: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  created: {
    type: Date,
    required: true
  }
});

const AppointmentModel = new mongoose.model("AppointmentInfo", AppointmentSchema);

module.exports = AppointmentModel;