var config = {};
if (process.env.NODE_ENV === 'development')
  require('dotenv').config();
module.exports = config;

config.attachmentPath = __dirname + '/../temp/';

config.blobPath = process.env.blobPath;

config.blobContainer = 'files';

config.emailTemplate = {
  subject: 'BES ID <BES> is pending approval review',
  message: 'BES ID <BES> for beneficiary: <BENEFICIARY_NAME> is pending approval review\n' +
    'Please access the following link to process it: <FORM_URL> \n' +
    'Thank you\n\n' +
    '**Do not reply to this account **\n'
};
config.emailSettings = {
  host: 'smtp.office365.com', // Office 365 server
  port: 587, // secure SMTP
  auth: {
    user: process.env.emailUser,
    pass: process.env.emailpassword
  },
  tls: {
    ciphers: 'SSLv3'
  }
};

config.mailOptions = {
  from: process.env.emailUser,
  to: '',
  subject: '',
  text: ''
};
config.besURL = process.env.besURL + '/payinfo?id=<ID>';


config.bespush = {
  url: process.env.bespushurl,
  username: process.env.bespushuser,
  password: process.env.bespushpassword
};

config.reviewEmail = process.env.reviewEmail;

config.treasuryEmail = process.env.treasuryEmail;
