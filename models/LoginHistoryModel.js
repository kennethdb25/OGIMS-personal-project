const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
  userId: {
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
  userType: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
  },
});

const LoginHistoryModel = new mongoose.model("LoginHistoryInfo", LoginHistorySchema);

module.exports = LoginHistoryModel;