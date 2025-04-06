const mongoose = require('mongoose');

const ViolationSchema = new mongoose.Schema({
  studentId: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  violationStatus: {
    type: String,
    required: true,
  },
  violation: {
    type: String,
    required: true,
  },
  violationDate: {
    type: String,
    required: true,
  },
  sanction: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
});


const ViolationModel = new mongoose.model("Violation", ViolationSchema);

module.exports = ViolationModel;