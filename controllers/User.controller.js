const AccountModel = require('../models/AccountModel');
const cipher = require("bcryptjs");
const LoginHistoryModel = require('../models/LoginHistoryModel');

const AccountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userEmail = await AccountModel.findOne({
      email: email,
      // acctStatus: "ACTIVE",
    });

    if (userEmail.acctStatus !== 'ACTIVE') {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    if (userEmail) {
      const isMatch = await cipher.compare(password, userEmail.password);
      if (!isMatch) {
        return res.status(401).json({ body: "Invalid Email or Password" });
        // validation for pending or disabled accounts
      } else {
        const token = await userEmail.generateAuthToken();

        res.cookie("UserCookie", token, {
          expire: new Date(Date.now + 604800000),
          httpOnly: true,
        });

        const { _id, firstName, middleName, lastName, userType, email } = userEmail;

        const loginHistoryDetails = new LoginHistoryModel({
          userId: _id.toString(),
          firstName,
          middleName,
          lastName,
          userType,
          created: new Date().toISOString(),
          email
        });

        await loginHistoryDetails.save();

        const result = {
          userEmail,
          token,
        };
        return res.status(201).json({ status: 201, result });
      }
    } else {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const AccountLogout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
      return currElem != req.token;
    });
    res.clearCookie("UserCookie", { path: "/" });

    req.rootUser.save();

    return res.status(201).json({ status: 201 });
  } catch (error) {
    console.log(error);
  }
};

const AccountValidate = async (req, res) => {
  try {
    const validAccount = await AccountModel.findOne({ _id: req.userId });
    return res.status(201).json({ body: validAccount });
  } catch (error) {
    return res.status(401).json({ body: "Unauthorized Access", status: 401 });
  }
};

const AccountSignup = async (req, res) => {
  const { userId, firstName, middleName, lastName, contact, address, gender, userType, email, password } = req.body;

  try {
    const validate = await AccountModel.findOne({ email });

    if (validate) {
      return res.status(422).json({ error: "Account Already Exists" });
    }

    const userDetails = new AccountModel({
      identification: userId,
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      address: address.toUpperCase(),
      contact,
      gender,
      userType: userType ? userType : 'STUDENT',
      password,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      acctStatus: 'ACTIVE',
      email
    });
    const data = await userDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const ForgotPasswordVerifyEmail = async (req, res) => {
  try {
    const getEmail = await AccountModel.findOne({ email: req.params.email, userType: 'STUDENT' });
    if (getEmail) {
      return res.status(200).json({
        status: 200,
        body: "Email Matched. Please click send button for OTP",
      });
    } else {
      return res
        .status(422)
        .json({ status: 422, body: "Email didn't match our records" });
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const ForgotPasswordUpdatePassword = async (req, res) => {
  console.log(req?.params.email);

  try {
    const email = req?.params.email;
    const password = await cipher.hash(req.body.password, 12);

    const getEmail = await AccountModel.findOne({ email: email, userType: 'STUDENT' });

    if (!getEmail) {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    await getEmail.updateOne({
      password: password,
    });

    return res
      .status(200)
      .json({ status: 200, body: "Recovered Successfully" });
  } catch (error) {
    return res.status(404).json(error);
  }
};

const AccountLoginHistory = async (req, res) => { };


module.exports = { AccountSignup, ForgotPasswordVerifyEmail, ForgotPasswordUpdatePassword, AccountLogin, AccountValidate, AccountLogout };
