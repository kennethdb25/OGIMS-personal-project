const AccountModel = require('../models/AccountModel');
const LoginHistoryModel = require('../models/LoginHistoryModel');

const AccountDetails = async (req, res) => {
  try {
    const accounts = await AccountModel.find();
    return res.status(200).json({ status: 200, body: accounts });
  } catch (error) {
    return res.status(404).json(error);
  }
};

const GetStudentList = async (req, res) => {
  try {
    const studentList = await AccountModel.find({ userType: "STUDENT" });
    const filteredList = studentList.map(user => ({ identification: user.identification, id: user._id, firstName: user.firstName, middleName: user.middleName, lastName: user.lastName, gender: user.gender, email: user.email, address: user.address, contact: user.contact }));
    return res.status(200).json({ status: 200, body: filteredList });
  } catch (error) {
    return res.status(404).json(error);
  }
};

const ChangeAccountStatus = async (req, res) => {
  const id = req.query.userId || "";
  try {
    const getUser = await AccountModel.findOne({ _id: id });
    if (!getUser) {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    getUser.acctStatus = getUser.acctStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const changeSuccess = await getUser.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const GetLoginHistoryList = async (req, res) => {
  try {
    const loginHistoryList = await LoginHistoryModel.find({});
    const filteredList = loginHistoryList.map(user => ({ id: user._id, firstName: user.firstName, middleName: user.middleName, lastName: user.lastName, userType: user.userType, email: user.email, created: user.created }));
    return res.status(200).json({ status: 200, body: filteredList });
  } catch (error) {
    return res.status(404).json(error);
  }
};


module.exports = { AccountDetails, GetStudentList, ChangeAccountStatus, GetLoginHistoryList };