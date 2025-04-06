const express = require('express');
const path = require('path');
const cors = require('cors');
require('./config/database/db.conf');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080; // server port


const UserRouter = require('./routes/User.routes');
const AccountRouter = require('./routes/Account.routes');
const ProcessRouter = require('./routes/Process.routes');
const ReportRouter = require('./routes/Report.routes');

// ROUTES
app.use(UserRouter);
app.use(AccountRouter);
app.use(ProcessRouter);
app.use(ReportRouter);

app.use('/file-uploads', express.static('./file-uploads'));

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
