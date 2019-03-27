var config = {};
require('dotenv').config();
module.exports = config;

config.attachmentPath = __dirname + '/../temp/';

config.blobPath = process.env.blobPath;
config.db_blobPath = process.env.db_blobpath;

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

config.appURL = process.env.besURL;


config.socketAuth = {
  username: process.env.socket_auth_username,
  password: process.env.socket_auth_password

};

config.besapi_url = process.env.besapi_url;



config.bespush = {
  url: process.env.bespushurl,
  username: process.env.bespushuser,
  password: process.env.bespushpassword
};

config.reviewEmail = process.env.reviewEmail;

config.treasuryEmail = process.env.treasuryEmail;

config.db_path = '../db/treasury.db'; //DB file path for Daily Azure backups
config.db_filename = 'treasury.db'; //DB file name for Daily Azure backups

config.fsg_forms = process.env.fsg_forms_url; //URL to FSG forms web app.
