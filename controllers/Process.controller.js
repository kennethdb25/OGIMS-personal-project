const AppointmentModel = require('../models/AppointmentModel');
const NotificationModel = require('../models/NotificationModel');
const RequestFormModel = require('../models/RequestModel');
const ViolationModel = require('../models/ViolationModel');

const AddRequestForm = async (req, res) => {
  try {
    const { userId, requestorName, email, contact, course, studentId, yearGraduated, year, section, requestRange, request, studentStatus } = req.body;
    var currentDate = new Date();
    if (currentDate.getDay() === 1) {
      currentDate.setDate(currentDate.getDate() + 4);
    } else if (currentDate.getDay() === 2) {
      currentDate.setDate(currentDate.getDate() + 6);
    } else {
      currentDate.setDate(currentDate.getDate() + 5);
    }

    const RequestFormDetails = new RequestFormModel({
      userId,
      requestorName,
      requestDate: new Date(),
      email,
      request,
      contact,
      requestStatus: "PENDING",
      course: course ? course : '',
      studentId,
      studentStatus: studentStatus ? studentStatus : '',
      yearGraduated: yearGraduated ? new Date(yearGraduated).getFullYear() : '',
      year: year ? year : '',
      section: section ? section : '',
      requestRange: requestRange ? requestRange : '',
      approximateDistributionDate: currentDate
    });

    const data = await RequestFormDetails.save();

    const notificationDetails = new NotificationModel({
      studentUserId: userId,
      requestId: data?._id,
      title: 'New Request Form',
      description: 'You have a new Request Form',
      type: 'Form',
      adminRead: false,
      created: new Date()
    });

    await notificationDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: 422, body: "Something went wrong. Please contact the administrator" });
  }
};

const GetAllRequestForm = async (req, res) => {
  try {
    const allRequestForm = await RequestFormModel.find();
    return res.status(200).json({ status: 200, body: allRequestForm });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const GetRequestFromPerStudent = async (req, res) => {
  const email = req.query.email || "";

  try {
    const getRequestFormPerStudent = await RequestFormModel.find({ email });
    return res.status(200).json({ status: 200, body: getRequestFormPerStudent });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const updateRequestFormStatus = async (req, res) => {
  const id = req.params.requestId || "";
  const { requestStatus, notes } = req.body;
  try {
    const getRequestForm = await RequestFormModel.findOne({ _id: id });

    if (!getRequestForm) {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    getRequestForm.requestStatus = requestStatus;
    getRequestForm.notes = notes;

    const changeSuccess = await getRequestForm.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getAppointmentsPerStudent = async (req, res) => {
  const email = req.query.email || "";

  try {
    const getAppointmentPerStudent = await AppointmentModel.find({ email });
    return res.status(200).json({ status: 200, body: getAppointmentPerStudent });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await AppointmentModel.find();
    return res.status(200).json({ status: 200, body: allAppointments });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const addAnAppointment = async (req, res) => {
  try {
    const { contact, date, email, requestorName, studentId, time, userId } = req.body;

    const appointmentDetails = new AppointmentModel({
      contact,
      date,
      email,
      requestorName,
      studentId,
      time,
      userId,
      appointmentStatus: "PENDING",
      created: new Date(),
    });

    const data = await appointmentDetails.save();

    const notificationDetails = new NotificationModel({
      studentUserId: userId,
      requestId: data?._id,
      title: 'New Appointment Scheduled',
      description: 'You have a new appointment request',
      type: 'Appointment',
      adminRead: false,
      created: new Date()
    });

    await notificationDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: 422, body: "Something went wrong. Please contact the administrator" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const id = req.params.requestId || "";
  const { requestStatus, notes } = req.body;
  try {
    const getRequestForm = await AppointmentModel.findOne({ _id: id });

    if (!getRequestForm) {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    getRequestForm.appointmentStatus = requestStatus;
    getRequestForm.notes = notes;

    const changeSuccess = await getRequestForm.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const addViolation = async (req, res) => {
  try {
    const { address, contact, firstName, gender, lastName, middleName, sanction, studentId, violation, violationDate } = req.body;

    const violationDetails = new ViolationModel({
      address,
      contact,
      firstName,
      gender,
      lastName,
      middleName,
      sanction,
      studentId,
      violation,
      violationDate,
      violationStatus: "IN PROGRESS",
      created: new Date()
    });

    const data = await violationDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: 422, body: "Something went wrong. Please contact the administrator" });
  }
};

const getAllViolation = async (req, res) => {
  try {
    const allViolations = await ViolationModel.find();
    return res.status(200).json({ status: 200, body: allViolations });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const updateViolationStatus = async (req, res) => {
  const id = req.params.violationId || "";
  const { requestStatus, notes } = req.body;
  try {
    const getViolation = await ViolationModel.findOne({ _id: id });

    if (!getViolation) {
      return res.status(401).json({ body: "Something went wrong. Please contact your Administrator!" });
    }

    getViolation.violationStatus = requestStatus;
    getViolation.notes = notes;

    const changeSuccess = await getViolation.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getUnreadNotificationForAdmin = async (req, res) => {
  try {
    const getNotificationForAdmin = await NotificationModel.find({ adminRead: false }).sort({ created: -1 });
    return res.status(200).json({ status: 200, body: getNotificationForAdmin });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getUnreadNotificationFOrStudent = async (req, res) => {
  const id = req.params.studentUserId || "";
  try {
    const getNotificationForStudent = await NotificationModel.find({ studentRead: false, studentUserId: id.toString() }).sort({ created: -1 });
    return res.status(200).json({ status: 200, body: getNotificationForStudent });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

module.exports = { AddRequestForm, GetAllRequestForm, GetRequestFromPerStudent, updateRequestFormStatus, getAppointmentsPerStudent, getAllAppointments, addAnAppointment, updateAppointmentStatus, addViolation, getAllViolation, updateViolationStatus };