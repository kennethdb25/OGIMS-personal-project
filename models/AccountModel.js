const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cipher = require('bcryptjs');
const keys = require('../config/keys');

const AccountSchema = new mongoose.Schema({
  identification: {
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
  acctStatus: {
    type: String,
    required: true,
  },
  gender: {
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
  modified: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

AccountSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await cipher.hash(this.password, 12);
  }
  next();
});

AccountSchema.methods.generateAuthToken = async function () {
  try {
    let token24 = jwt.sign({ _id: this._id }, keys.cookieKey, {
      expiresIn: "7d",
    });

    this.tokens = this.tokens.concat({ token: token24 });
    await this.save();
  } catch (error) {
    console.log(error);
  }
};

const AccountModel = new mongoose.model("AccountInfo", AccountSchema);

module.exports = AccountModel;