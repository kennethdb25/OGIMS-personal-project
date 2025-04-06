const express = require('express');
const ProcessRouter = new express.Router();
const { AddRequestForm, GetAllRequestForm, GetRequestFromPerStudent, updateRequestFormStatus, getAppointmentsPerStudent, getAllAppointments, addAnAppointment, updateAppointmentStatus, addViolation, getAllViolation, updateViolationStatus } = require('../controllers/Process.controller');

// ADD REQUEST FORM //
ProcessRouter.post('/api/requests', AddRequestForm);

// GET REQUEST FORM PER STUDENT //
ProcessRouter.get('/api/requests/student', GetRequestFromPerStudent);

// GET ALL REQUEST FORM //
ProcessRouter.get('/api/requests/all', GetAllRequestForm);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch('/api/requests/status/:requestId', updateRequestFormStatus);

// GET APPOINTMENT PER STUDENT
ProcessRouter.get('/api/appointments/student', getAppointmentsPerStudent);

// GET ALL APPOINTMENTS //
ProcessRouter.get('/api/appointments', getAllAppointments);

// SET AN APPOINTMENTS //
ProcessRouter.post('/api/appointments', addAnAppointment);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch('/api/appointments/status/:requestId', updateAppointmentStatus);

//ADD VIOLATION //
ProcessRouter.post('/api/violation', addViolation);

//GET ALL VIOLATIONS //
ProcessRouter.get('/api/violation', getAllViolation);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch('/api/violation/status/:violationId', updateViolationStatus);

module.exports = ProcessRouter;
