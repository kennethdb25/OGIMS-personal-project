const express = require('express');
const AccountRouter = new express.Router();
const { AccountDetails, GetStudentList, ChangeAccountStatus, GetLoginHistoryList } = require('../controllers/Account.controller');

AccountRouter.get('/api/accounts', AccountDetails);

AccountRouter.get('/api/student-list', GetStudentList);

AccountRouter.patch('/api/change-account-status', ChangeAccountStatus);

AccountRouter.get('/api/login-history-list', GetLoginHistoryList);

module.exports = AccountRouter;