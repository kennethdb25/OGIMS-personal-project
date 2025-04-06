const mongoose = require('mongoose');

const RequestFormSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  requestorName: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    required: true,
  },
  approximateDistributionDate: {
    type: Date,
    required: true,
  },
  requestStatus: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  yearGraduated: {
    type: String,
  },
  year: {
    type: String,
  },
  section: {
    type: String,
  },
  studentStatus: {
    type: String,
  },
  requestRange: {
    type: String,
  },
  request: {
    type: String,
  },
  notes: {
    type: String,
  },
});



const RequestFormModel = new mongoose.model("RequestForm", RequestFormSchema);

module.exports = RequestFormModel;