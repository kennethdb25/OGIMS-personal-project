const express = require('express');
const { AddReport, GetAllReport, DownloadReport, GetDashboardCardCount, getUpcomingAppointment } = require('../controllers/Report.controller');
const ReportRouter = new express.Router();

ReportRouter.post('/api/generate-rerpot', AddReport);

ReportRouter.get('/api/report/get-generated', GetAllReport);

ReportRouter.get('/api/report/download-csv', DownloadReport);

ReportRouter.get('/api/dashboard/count', GetDashboardCardCount);

ReportRouter.get('/api/dashboard/upcoming', getUpcomingAppointment);

module.exports = ReportRouter;