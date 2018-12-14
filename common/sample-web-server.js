/**
 * A simple web server that initializes the OIDC Middleware library with the
 * given options, and attaches route handlers for the example profile page
 * and logout functionality.
 */

//Query helper
const Query = require('../common/query.js');

const express = require('express'),
  bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const path = require('path');
const { ExpressOIDC } = require('@okta/oidc-middleware');

require('dotenv').config();
const config = require('./config');
const azure = require('azure-storage');

const multiparty = require('multiparty');
const https = require('https');
const qs = require('querystring');

const _ = require('lodash');
const fs = require('fs');

const validator = require('validator');
const nodemailer = require('nodemailer');



const templateDir = path.join(__dirname, '..', 'common', 'views');
const frontendDir = path.join(__dirname, '..', 'common', 'assets');

module.exports = function SampleWebServer(sampleConfig, extraOidcOptions, homePageTemplateName) {

  const blobService = azure.createBlobService();

  const oidc = new ExpressOIDC(Object.assign({
    issuer: sampleConfig.oidc.issuer,
    client_id: sampleConfig.oidc.clientId,
    client_secret: sampleConfig.oidc.clientSecret,
    redirect_uri: sampleConfig.oidc.redirectUri,
    scope: sampleConfig.oidc.scope
  }, extraOidcOptions || {}));

  // set up the routing object using express
  const app = express();
  app.use(bodyParser.json());

  // set session seed
  app.use(session({
    secret: '25388f6326e841678396dba241e3436e99a2147971a96ecb407db96325756aa3',
    resave: true,
    saveUninitialized: false
  }));

  // Provide the configuration to the view layer because we show it on the homepage
  const displayConfig = Object.assign({},
    sampleConfig.oidc, {
      clientSecret: '****' + sampleConfig.oidc.clientSecret.substr(sampleConfig.oidc.clientSecret.length - 4, 4)
    }
  );

  app.locals.oidcConfig = displayConfig;

  // This server uses mustache templates located in views/ and css assets in assets/
  app.use('/assets', express.static(frontendDir));
  app.engine('mustache', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', templateDir);

  app.use(oidc.router);

  /* this is broken with the Okta OIDC connector 1.0.0 from 0.1.3
  app.get('/', (req, res) => {
    const template = homePageTemplateName || 'home';
    res.render(template, {
      isLoggedIn: !! req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });
  */

  app.get('/', oidc.ensureAuthenticated(), (req, res) => {
    res.render('home', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });

  app.get('/profile', oidc.ensureAuthenticated(), (req, res) => {
    // Convert the userinfo object into an attribute array, for rendering with mustache
    //const attributes = Object.entries(req.userContext.userinfo);
    res.render('profile', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });

  /**
   * Jorge Medina 12/07/2018 Added query string params to create direct URL to specific BES
   * */
  app.get('/payinfo', oidc.ensureAuthenticated(), (req, res) => {
    res.render('payinfo', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo,
      id: (req.query.id) ? req.query.id : "" //pass BES ID if present
    });
  });

  /**
   * Jorge Medina 12/12/2018 Added Vendors routes to review external vendor forms
   * */
  app.get('/vendors', oidc.ensureAuthenticated(), (req, res) => {
    res.render('vendors', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });

  /**
   * Jorge Medina 12/12/2018 Added Vendors routes to review external vendor forms
   * */
  app.get('/vendorform', (req, res) => {
    res.render('vendorform', {

    });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });



  oidc.on('ready', () => {
    app.listen(sampleConfig.port, () => console.log(`App started on port ${sampleConfig.port}`));
  });

  oidc.on('error', err => {
    // An error occurred while setting up OIDC
    throw err;
  });

















  //Write a workflow step
  function WorkflowAction(wfstep, objtype, id, username, notes, isNew = false) {

    /*
    console.log(wfstep);
    console.log(objtype);
    console.log(id);
    console.log(username);
    console.log(notes);
    console.log(isNew);
    */
    var msg = '';

    if (!isNew) {

      //get the current step and if the current user is allowed to take action on it
      var CurrentStep = new Query(`
      select
        a.fk_wfstep_id id
      , u.username authorized_user
      , a.username approver
      , s.name
      from wfaction a
      left join wfstepusers u on u.fk_wfstep_id = a.fk_wfstep_id and u.username = ?
      left join wfstep s on s.id = a.fk_wfstep_id
      where
      a.fk_object_id = ?
      and a.fk_objtype_id = ?
      order by a.id desc
      limit 1;`, [
        username, id, objtype
      ]).get();

      this.CurrentStep = CurrentStep;

      //console.log(CurrentStep);

      //must have different approvers except for entry and hold
      if (CurrentStep.approver === username && CurrentStep.id !== 1 && CurrentStep.id !== 4 && username != 'Jorge.Medina@relatedgroup.com') {
        msg = 'Cannot save changes. Previous approver is the same as current approver (' + username + ')';
        //console.log(msg);
        this.msg = msg;
        return;
      }

      if (CurrentStep.id === 5 && wfstep === 1) {
        console.log('Approved record moved to Entry step');
        this.msg = '';
        return;
      }

      if (CurrentStep.id === 1 && (wfstep === null || wfstep === '')) {
        console.log('Entry step with no next step. Skip validation');
        this.msg = '';
        return;
      }

      //anyone can advance workflow in entry and review step
      if (CurrentStep.authorized_user === null && CurrentStep.id !== 1 && CurrentStep.id !== 2 && CurrentStep.id !== 6) {
        msg = '' + username + ' is not authorized modify records in the ' + CurrentStep.name + ' step';
        //console.log(msg);
        this.msg = (msg);
        return;
      }
    }

    if (wfstep !== null && wfstep !== '') {
      //var payload = req.body;
      /*
      var payload = {
        wfstepnext: 5,
        objtype: 1,
        notes:'lol'
      }
      */

      //console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
      //console.log(payload);

      /* check to see if the selected step is valid for the current object */
      var isValidStep = new Query(`
      select count(*) value from wfaction wfa
      join wfstepnext wfn on wfn.fk_wfstep_id = wfa.fk_wfstep_id
      where
      wfn.fk_wfstep_id_next = ?
      and wfa.id = (
        select id from wfaction
        where fk_objtype_id = ?
        and fk_object_id = ?
        order by id desc limit 1);`, [
        wfstep,
        objtype,
        id
      ]).get();

      console.log('Valid steps found: ' + isValidStep.value);

      if (isNew || isValidStep !== null && isValidStep.value > 0) {

        console.log('Proposed next workflow step is valid for ' + id);

        var WorkflowAction = new Query(`
        INSERT INTO wfaction (
          'fk_wfstep_id',
          'fk_objtype_id',
          'fk_object_id',
          'username',
          'notes') values (?,?,?,?,?);`, [
          wfstep,
          objtype,
          id,
          username,
          notes
        ]).run();

        //new Query().audit(req, {'eftpayee: workflow' : payload}, 'valid');
        //console.log(JSON.stringify(this));
        this.msg = ('');

      }
      else {
        //new Query().audit(req, {'eftpayee: workflow' : payload}, 'error');
        msg = 'Invalid proposed workflow step for item ' + JSON.stringify(this);
        console.log(msg);
        this.msg = (msg);
      }

    }
    else {
      msg = 'No changes saved: Next step is missing';
      console.log(msg);
      this.msg = (msg);
    }
  };




  /*====================================================
  Set initial workflow step for new imported records
  */
  app.get('/payinfo/import', oidc.ensureAuthenticated(), (req, res) => {
    if (req.isAuthenticated() & req.userContext.userinfo.preferred_username === 'dchin@relatedgroup.com') {
      var payload = req.body;
      console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
      //console.log(payload);
      try {
        for (var i = 1; i <= 82; i++) {

          var WorkflowAction = new Query(`
          INSERT INTO wfaction (
            'fk_wfstep_id',
            'fk_objtype_id',
            'fk_object_id',
            'username',
            'notes') values (?,?,?,?,?);`, [
            2,
            1,
            i,
            'SYSTEM',
            'import'
          ]).run();

          console.log('WFACTION INJECTED FOR ' + i)

        }
        //console.log(setWorkflow);
        res.send({ msg: '' });
      }
      catch (err) {

        console.log(err);
        res.status(500);
        res.send(err);
      }
    }
    else {
      res.status(401);
      res.send('Unauthorized');
    }
  });


  /**
   *  Jorge Medina  12/03/2018 Route to store attachments into folder
   * */

  app.post('/attach', oidc.ensureAuthenticated(), (req, res) => {
    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    try {
      var form = new multiparty.Form();
      var payload = { id: "", files: {} };
      form.parse(req, (err, fields, files) => {
        payload.id = fields.id[0];
        payload.files = files;
        var promiseArr = [];
        _.values(files).forEach((file) => {
          promiseArr.push(uploadFile(file, fields, req.userContext.userinfo.preferred_username, req, payload));
          /* var fileStamp = (now.getMonth() + 1) + '' + (now.getDate()) + '' + (now.getFullYear()) + '' + (now.getHours()) + '' + (now.getMinutes());
           var insert = new Query(`INSERT INTO eftattach(
           fk_object_id,
           filename,
           dateadded,
           dateupdated,
           datedeleted,
           user
           )
           VALUES(?,?,?,?,?,?);`, [
             fields.id[0],
             fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename,
             now.toLocaleDateString(),
             now.toLocaleDateString(),
             null,
             req.userContext.userinfo.preferred_username
           ]).run();

           var fileID = insert.lastInsertROWID;

           fs.copyFile(file[0].path, fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, (err) => {
             if (err) console.log(err);
             //console.log(`${file[0].path} copied to ${config.attachmentPath+file[0].originalFilename}`);
             blobService.createBlockBlobFromLocalFile(config.blobContainer, config.blobPath + fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename,
               function (error, result, response) {
                 if (error) {
                   console.log(error)
                   del = new Query('DELETE FROM eftattach WHERE id=?;', [fileID]).run();
                   res.send({ msg: 'Unable to process file' });
                 }
                 else {
                   console.log("uploaded to azure");
                   fs.unlink(fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, (err) => {
                     if (err) {
                       console.log(err)
                       res.send({ msg: 'Unable to process file' });
                     };
                     console.log(fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename + ' was deleted from local');
                     new Query().audit(req, [{ 'attachments': payload }], null, fields.id[0], 1);
                     if (index == _.values(files).length - 1) res.send({ msg: '' });
                   });
                 }
               }
             )

           });*/
        })

        Promise.all(promiseArr)
          .then((values) => {
            res.send({ msg: '' });
          })
          .catch((err) => {
            console.log(err);
            res.send({ msg: 'Unable to save all files' });
          })
      });
    }
    catch (err) {
      console.log(err);
      res.status(500);
      res.send(err);
    }
  });

  function uploadFile(file, fields, username, req, payload) {
    return new Promise((resolve, reject) => {
      var now = new Date();
      var fileStamp = (now.getMonth() + 1) + '' + (now.getDate()) + '' + (now.getFullYear()) + '' + (now.getHours()) + '' + (now.getMinutes());
      var insert = new Query(`INSERT INTO eftattach(
          fk_object_id,
          filename,
          dateadded,
          dateupdated,
          datedeleted,
          user
          )
          VALUES(?,?,?,?,?,?);`, [
        fields.id[0],
        fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename,
        now.toLocaleDateString(),
        now.toLocaleDateString(),
        null,
        username
      ]).run();

      var fileID = insert.lastInsertROWID;

      fs.copyFile(file[0].path, fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, (err) => {
        if (err) console.log(err);
        //console.log(`${file[0].path} copied to ${config.attachmentPath+file[0].originalFilename}`);
        blobService.createBlockBlobFromLocalFile(config.blobContainer, config.blobPath + fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename,
          function (error, result, response) {
            if (error) {
              console.log(error)
              del = new Query('DELETE FROM eftattach WHERE id=?;', [fileID]).run();
              reject();
            }
            else {
              console.log("uploaded to azure");
              fs.unlink(fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename, (err) => {
                if (err) {
                  console.log(err);
                  reject();
                };
                console.log(fields.id[0] + '_' + fileStamp + '_' + file[0].originalFilename + ' was deleted from local');
                new Query().audit(req, [{ 'attachments': payload }], null, fields.id[0], 1);
                resolve();
              });
            }
          }
        )

      })
    })
  };



  /**
   *
   * */
  app.get('/faq', oidc.ensureAuthenticated(), (req, res) => {
    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
    /*try {
      fs.readFile(__dirname + '/../common/assets/documents/faq.pdf', (err, data) => {
        if (err) {
          res.send({ msg: 'File not found on server' + err });
        }
        else {
          res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment;filename=faq.pdf' });
          res.end(data, 'binary');
        }
      });
    }
    catch (err) {
      console.log(err);
      res.send({ msg: 'Unable to retrieve faq' });
    }*/
    res.render('faq', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });
  /**
   * Jorge Medina: 12/04/2018 -> Route to serve files on request
   * */

  app.get('/file/:filename', oidc.ensureAuthenticated(), (req, res) => {
    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
    try {
      var filename = req.params.filename;
      blobService.getBlobToLocalFile(config.blobContainer, config.blobPath + filename, config.attachmentPath + filename.substring(filename.indexOf('_', 5) + 1), (error, data) => {
        if (!error) {
          fs.readFile(config.attachmentPath + filename.substring(filename.indexOf('_', 5) + 1), (err, data) => {
            if (err) {
              res.send({ msg: "File not found on server" + err });
            }
            else {
              // Blob available in serverBlob.blob variable
              console.log(filename.substring(filename.indexOf('_', 5) + 1));
              switch (filename.substring(filename.lastIndexOf('.')).toLowerCase()) {
              case 'pdf':
                res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'jpg':
              case 'jpeg':
                res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'bmp':
                res.writeHead(200, { 'Content-Type': 'image/bmp', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'xls':
              case 'xlsx':
              case 'xlsm':
                res.writeHead(200, { 'Content-Type': 'application/excel', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'doc':
              case 'docx':
                res.writeHead(200, { 'Content-Type': 'application/msword', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'tiff':
              case 'tif':
                res.writeHead(200, { 'Content-Type': 'image/tiff', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'gif':
                res.writeHead(200, { 'Content-Type': 'image/gif', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'txt':
                res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'msg':
                res.writeHead(200, { 'Content-Type': 'application/vnd.ms-outlook', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'zip':
                res.writeHead(200, { 'Content-Type': 'application/x-compressed', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              case 'ppt':
              case 'pptx':
                res.writeHead(200, { 'Content-Type': 'application/mspowerpoint', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break
              case 'png':
                res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Disposition': 'attachment;filename=' + filename.substring(filename.indexOf('_', 5) + 1) });
                break;
              default:
                // code
              }
              res.end(data, 'binary');

              //file sent to user ==> delete it

              fs.unlink(config.attachmentPath + filename.substring(filename.indexOf('_', 5) + 1), (err) => {
                if (err) console.log(err);
              });

            }
          });
        };

      });
    }
    catch (err) {
      console.log(err);
      res.status(500);
      res.send(err);
    }
  });

  /*====================================================
  Workflow: Get valid next steps for a given object
  */
  app.get('/workflow/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    if (req.isAuthenticated()) {

      //var payload = req.body;

      var payload = {
        objtype: 1,
      };

      console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
      //console.log(payload);

      /* check to see if the selected step is valid for the current object */
      var validSteps = new Query(`
      select wfs.* from wfaction wfa
      join wfstepnext wfn on wfn.fk_wfstep_id = wfa.fk_wfstep_id
      join wfstep wfs on wfs.id = wfn.fk_wfstep_id_next
      where
      wfa.id = (select id from wfaction
        where fk_objtype_id = ?
        and fk_object_id = ?
        order by id desc limit 1);`, [
        payload.objtype,
        req.params.id
      ]).all();

      //console.log(validSteps);
      res.send(validSteps);

    }
  });













  /*====================================================
  Delete records*/
  app.delete('/payinfo/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    if (req.userContext.userinfo.preferred_username === 'dchin@relatedgroup.com') {

      console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

      var del = new Query('DELETE FROM eftpayee WHERE id=?;', [req.params.id]).run();
      //console.log(del);
      del = new Query('DELETE FROM wfaction WHERE fk_object_id=? and fk_objtype_id = 1;', [req.params.id]).run();
      //console.log(del);
      //delete attachments record
      del = new Query('DELETE FROM eftattach WHERE fk_object_id=?;', [req.params.id]).run();

      //delete from file server or move?

      //Write username and data to the audit log
      new Query().audit(req, null, null, req.params.id, 1);
      //console.log(del);
      res.send({ msg: '' });

    }

    else {
      res.send({ msg: '' + req.userContext.userinfo.preferred_username + ' does not have access to delete records.' });
    }

  });
  /**
   * Audit for files attach to a record
   * */

  app.get('/auditFiles/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
    var sql = 'select * from auditlog where fk_id = @id and action like @attachAction;';
    var select = new Query(sql, { id: req.params.id, attachAction: '%attach%' }).all();


    for (var row of select) {
      if (row.payload !== null) {
        row.payload = JSON.parse(row.payload);
      }
    }

    res.json(select);

  });
  /*====================================================
  Pull audit logs for a record*/
  app.get('/audit/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
    var sql = 'select * from auditlog where fk_id = @id and action not like @attachAction;';
    var select = new Query(sql, { id: req.params.id, attachAction: '%attach%' }).all();


    for (var row of select) {
      if (row.payload !== null) {
        row.payload = JSON.parse(row.payload);
      }
    }

    res.json(select);

  });

  /*
  ====================================================
  Read records or filter by query string
  */
  app.get('/payinfo/list', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    //Prepare an array to hold query parameters. Prevent SQL injection attacks.
    var queryParams = [];

    //build the where statement depending on the fields the user is searching by
    var where = '';
    if (req.query.id !== undefined && req.query.id !== '') {
      //where += ' AND e1.rowid=' + req.query.id;
      where += ' AND e1.rowid=?';
      queryParams.push(req.query.id);
    };
    if (req.query.workflow !== undefined && req.query.workflow !== '') {
      //where += ' AND s.name=\'' + req.query.workflow + '\'';

      if (req.query.workflow === 'Pending') {
        where += ' AND NOT s.name = ?';
        queryParams.push('Approved');
      }
      else if (req.query.workflow === 'All') {
        //do nothing, all BES including incative ones
      }
      else {
        where += ' AND s.name=?';
        queryParams.push(req.query.workflow);
      }

    }
    else {
      where += ' AND NOT s.name =?';
      queryParams.push('Inactive');
    };
    if (req.query.type !== undefined && req.query.type !== '') {
      //where += ' AND e1.paytype=\'' + req.query.type + '\'';
      where += ' AND e1.paytype=?';
      queryParams.push(req.query.type);
    };
    if (req.query.source !== undefined && req.query.source !== '') {
      //where += ' AND e1.sourcesystem=\'' + req.query.source + '\'';
      where += ' AND e1.sourcesystem like ?';
      queryParams.push('%' + req.query.source + '%');
    };
    if (req.query.vendor !== undefined && req.query.vendor !== '') {
      //where += ' AND (e1.vendorid like \'%' + req.query.vendor + '%\' or e1.payeename like \'%' + req.query.vendor + '%\')';
      where += ' AND (e1.vendorid like ? or e1.payeename like ?)';
      queryParams.push('%' + req.query.vendor + '%');
      queryParams.push('%' + req.query.vendor + '%');
    };
    if (req.query.bank !== undefined && req.query.bank !== '') {
      //where += ' AND e1.bankname=\'' + req.query.bank + '\'';
      where += ' AND e1.bankname like ?';
      queryParams.push('%' + req.query.bank + '%');
    };

    console.log(where);
    console.log(queryParams);

    var sql = `
    select e1.*, ifnull(s.name,'') wfstep_name from eftpayee e1
    	left join
    		(
    			select e2.id fk_object_id, max(a.id) fk_faction_id from eftpayee e2
    			left join wfaction a on a.fk_object_id = e2.id and a.fk_objtype_id = 1
    			group by e2.id
    		) z on z.fk_object_id = e1.id
    	left join wfaction a2 on a2.id = z.fk_faction_id
    	left join wfstep s on s.id = a2.fk_wfstep_id
    	WHERE 1=1` + where + `
    	order by e1.id desc;`;

    //console.log(sql);

    //get each object and the workflow step
    var select = new Query(sql, queryParams).all();
    res.json(select);
  });









  /*
  ====================================================
  Get a single record
  */

  function CurrentStep(objType, id) {

    var result = new Query(`
    select wfs.*, wf.name wfname from wfaction wfa
    join wfstep wfs on wfs.id = wfa.fk_wfstep_id
    join wf on wf.id = wfs.fk_wf_id
    where
    wfa.id = (select id from wfaction
      where fk_objtype_id = ?
      and fk_object_id = ?
      order by id desc limit 1);`, [
      objType,
      id
    ]).get();

    if (result === undefined) {
      return { id: null, fk_wf_id: null, name: '(None)', notes: null, modified: null, wfname: 'No Workflow Assigned' };
    }
    else {
      return result;
    }

  }

  app.get('/payinfo/:id', oidc.ensureAuthenticated(), (req, res) => {

    var objType = 1;

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    //Get all payment instructions
    var obj = new Query('SELECT * from eftpayee where id=?', [req.params.id]).get();

    //Get all valid next steps for the item
    var nextsteps = new Query(`
    select wfs.*, wf.name wfname from wfaction wfa
    join wfstepnext wfn on wfn.fk_wfstep_id = wfa.fk_wfstep_id
    join wfstep wfs on wfs.id = wfn.fk_wfstep_id_next
    join wf on wf.id = wfs.fk_wf_id
    where
    wfa.id = (select id from wfaction
      where fk_objtype_id = ?
      and fk_object_id = ?
      order by id desc limit 1);`, [
      objType,
      req.params.id
    ]).all();


    //Get Attachments if Any
    var attachments = new Query('SELECT * from eftattach where fk_object_id=?', [req.params.id]).all();

    //
    //Get the current workflow step for the item
    var currentstep = new CurrentStep(1, req.params.id);

    //Get the current workflow step for the item
    var stephistory = new Query('select a.username, a.notes, a.modified, s.name from wfaction a join wfstep s on s.id = a.fk_wfstep_id where a.fk_object_id = ? order by a.modified desc;', [req.params.id]).all();

    //If no steps came back feed bake a dummy result in
    if (nextsteps === undefined || nextsteps.length === 0) {
      nextsteps = [{ id: null, fk_wf_id: null, name: '(None)', notes: null, modified: null, wfname: 'No Workflow Assigned' }];
    }
    else {
      //add a blank option to the array of valid next steps. This is used to save edits without advancing the workflow
      nextsteps.unshift({ id: '', fk_wf_id: '', name: '', notes: '', modified: '', wfname: '' });
    }

    if (currentstep.isapproval === 1) {
      obj.wfstatus = 'Completed';
    }
    else {
      obj.wfstatus = 'Pending';
    }


    //Wrap everything up into an object to send out
    var payload = {
      obj: obj,
      nextsteps: nextsteps,
      currentstep: currentstep,
      stephistory: stephistory,
      attachments: attachments //send attachments on response
    };

    //console.log(payload);

    //res.json(JSON.payload);
    res.send(JSON.stringify(payload, null, 4));

  });









  /*
  ====================================================
  Save edits to a single record
  */

  app.put('/payinfo/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    //lazy shortcut
    var payload = req.body;
    validatePayload(payload)
      .then(function (validationErrors) {

        if (validationErrors.length >= 1 && (payload.wf_stepnext === '2' || payload.wf_stepnext === null || payload.wf_stepnext === '')) { //onlyy return the error if bes in entry state
          res.send({ msg: '', validationErrors: validationErrors });
          return; //force end of execution
        }


        var setWorkflow = new WorkflowAction(payload.wf_stepnext, 1, req.params.id, req.userContext.userinfo.preferred_username, payload.wf_notes);

        //console.log(setWorkflow);




        /* Check for workflow validation */
        if (setWorkflow.msg !== '') {
          //Return the error message if validation fails
          res.send(setWorkflow);

        }
        else if (setWorkflow.CurrentStep.id !== 1) {

          //Only 1.ENTRY step is valid to save changes other than workflow. Skip saving changes if any other step.
          new Query().audit(req, [{ 'eftpayee': payload }], null, req.params.id, 1);

          //send email notification to next step approver
          if (payload.wf_stepnext === '3') {
            //email treasury
            res.send({ msg: '' });
            sendEmail(config.treasuryEmail, req.params.id, payload.payeename)
              .then(() => {
                console.log('email sent!');
              })
              .catch((err) => {
                console.log('Unable to email users');
                res.send({ msg: '' });
              })

          }
          else
            res.send({ msg: '' });

          /*if (payload.wf_stepnext === '5') {
            console.log('need to send to Yardi');
            pushToYardi(req.params.id)
              .then(() => {
                res.send({ msg: '' });
              })
          }
          else*/
          //res.send({ msg: '' });

        }
        else {

          //Only save edits if the workflow action is valid
          //if (setWorkflow.msg.err === null) {

          try {
            var select = new Query(`UPDATE eftpayee
        SET vendorid = ?,
         sourcesystem = ?,
         payeename = ?,
         payeeaddress = ?,
         payeecity = ?,
         payeestate = ?,
         payeezip = ?,
         payeecountry = ?,
         forfurthercredit = ?,
         bankname = ?,
         bankaddress = ?,
         bankcity = ?,
         bankstate = ?,
         bankzip = ?,
         bankcountry = ?,
         paytype = ?,
         achsec = ?,
         routing = ?,
         account = ?,
         swift = ?,
         interbankname = ?,
         interbankaddress = ?,
         interbankcity = ?,
         interbankstate = ?,
         interbankzip = ?,
         interbankcountry = ?,
         interrouting = ?,
         interswift = ?,
         notes = ?
         WHERE id = ?;`, [
              payload.vendorid,
              payload.sourcesystem,
              payload.payeename,
              payload.payeeaddress,
              payload.payeecity,
              payload.payeestate,
              payload.payeezip,
              payload.payeecountry,
              payload.forfurthercredit,
              payload.bankname,
              payload.bankaddress,
              payload.bankcity,
              payload.bankstate,
              payload.bankzip,
              payload.bankcountry,
              payload.paytype,
              payload.achsec,
              payload.routing,
              payload.account,
              payload.swift,
              payload.interbankname,
              payload.interbankaddress,
              payload.interbankcity,
              payload.interbankstate,
              payload.interbankzip,
              payload.interbankcountry,
              payload.interrouting,
              payload.interswift,
              payload.notes,
              req.params.id
            ]).run();

            //Write username and data to the audit log
            //new Query().audit(req, [{'eftpayee' : payload}]);
            new Query().audit(req, [{ 'eftpayee': payload }], null, req.params.id, 1);


            if (payload.wf_stepnext === '2') {
              //need to email review
              res.send({ msg: '' });
              sendEmail(config.reviewEmail, req.params.id, payload.payeename)
                .then(() => {
                  console.log('email sent!')
                })
                .catch((err) => {
                  console.log('Unable to email users');
                  res.send({ msg: '' });
                })

            }
            else
              res.send({ msg: '' });
          }
          catch (err) {
            console.log(err);
            res.status(500);
            res.send(err);
          }

          /*
          } else {
            res.send({msg: setWorkflow.msg.err});
          }
          */
        }

      })
    //Update workflow first

  });
















  /*====================================================
  NEW : Create record
  */
  app.post('/payinfo/new', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    if (req.isAuthenticated()) {

      var payload = req.body;

      console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);
      //console.log(payload);

      try {

        validatePayload(payload)
          .then(function (validationErrors) {

            /* if (validationErrors.length >= 1) { //do not throw the error if new BES only when send to Review.
               res.send({ msg: '', validationErrors: validationErrors });
               return; //force end of execution
             }*/
            var insert = new Query(`INSERT INTO eftpayee(
          vendorid,
          sourcesystem,
          payeename,
          payeeaddress,
          payeecity,
          payeestate,
          payeezip,
          payeecountry,
          forfurthercredit,
          bankname,
          bankaddress,
          bankcity,
          bankstate,
          bankzip,
          bankcountry,
          paytype,
          achsec,
          routing,
          account,
          swift,
          interbankname,
          interbankaddress,
          interbankcity,
          interbankstate,
          interbankzip,
          interbankcountry,
          interrouting,
          interswift,
          notes
          )
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`, [
              payload.vendorid,
              payload.sourcesystem,
              payload.payeename,
              payload.payeeaddress,
              payload.payeecity,
              payload.payeestate,
              payload.payeezip,
              payload.payeecountry,
              payload.forfurthercredit,
              payload.bankname,
              payload.bankaddress,
              payload.bankcity,
              payload.bankstate,
              payload.bankzip,
              payload.bankcountry,
              payload.paytype,
              payload.achsec,
              payload.routing,
              payload.account,
              payload.swift,
              payload.interbankname,
              payload.interbankaddress,
              payload.interbankcity,
              payload.interbankstate,
              payload.interbankzip,
              payload.interbankcountry,
              payload.interrouting,
              payload.interswift,
              payload.notes
            ]).run();

            //console.log(insert);

            //Write username and data to the audit log
            //new Query().audit(req, {'eftpayee' : payload});
            new Query().audit(req, [{ 'eftpayee': payload }], null, insert.lastInsertROWID, 1);

            //Set initial workflow step for new record
            var setWorkflow = new WorkflowAction(1, 1, insert.lastInsertROWID, req.userContext.userinfo.preferred_username, payload.wf_notes, true);
            //console.log(setWorkflow);

            res.send({ msg: '', id: insert.lastInsertROWID });
          })

      }
      catch (err) {

        console.log(err);
        res.status(500);
        res.send(err);
      }
    }
    else {
      res.status(401);
      res.send('Unauthorized');
    }
  });


  /**
   * List all Submitted Vendors
   * */
  app.get('/vendor/list', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    //Prepare an array to hold query parameters. Prevent SQL injection attacks.
    var queryParams = [];

    //build the where statement depending on the fields the user is searching by
    var where = '';
    if (req.query.id !== undefined && req.query.id !== '') {
      //where += ' AND e1.rowid=' + req.query.id;
      where += ' AND e1.rowid=?';
      queryParams.push(req.query.id);
    };

    if (req.query.legalentityname !== undefined && req.query.legalentityname !== '') {
      //where += ' AND e1.paytype=\'' + req.query.type + '\'';
      where += ' AND e1.legalentityname=?';
      queryParams.push(req.query.legalentityname);
    };
    if (req.query.taxid !== undefined && req.query.taxid !== '') {
      //where += ' AND e1.sourcesystem=\'' + req.query.source + '\'';
      where += ' AND e1.taxid like ?';
      queryParams.push('%' + req.query.taxid + '%');
    };

    console.log(where);
    console.log(queryParams);

    var sql = `
    select e1.* from vendorforms e1
    	WHERE 1=1` + where + `
    	order by e1.id desc;`;

    //console.log(sql);

    //get each object and the workflow step
    var select = new Query(sql, queryParams).all();
    res.json(select);
  });

  /**
   * Get Vendor
   * */
  app.get('/vendor/:id', oidc.ensureAuthenticated(), (req, res) => {

    var objType = 1;

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username + ' ' + req.headers['x-real-ip']);

    //Get all payment instructions
    var obj = new Query('SELECT * from vendorforms where id=?', [req.params.id]).get();


    //Wrap everything up into an object to send out
    var payload = {
      obj: obj
    };

    //console.log(payload);

    //res.json(JSON.payload);
    res.send(JSON.stringify(payload, null, 4));

  });
  /**
   * Jorge Medina 12/12/2018 - Save new external vendor forms
   * */
  app.post('/vendor/new', (req, res) => {

    console.log(req.method + ' ' + req.url);

    var payload = req.body;


    try {

      validateVendorPayload(payload)
        .then(function (validationErrors) {

          if (validationErrors.length >= 1) {
            res.send({ msg: '', validationErrors: validationErrors });
            return; //force end of execution
          }
          var insert = new Query(`INSERT INTO vendorforms(
          legalentityname,
          dba,
          taxid,
          email1099,
          vendorname,
          title,
          address1,
          address2,
          city,
          state,
          zip
          )
          VALUES(?,?,?,?,?,?,?,?,?,?,?);`, [
            payload.legalentityname,
            payload.dba,
            payload.taxid,
            payload.email1099,
            payload.vendorname,
            payload.title,
            payload.address1,
            payload.address2,
            payload.city,
            payload.state,
            payload.zip
          ]).run();

          //console.log(insert);


          res.send({ msg: '', id: insert.lastInsertROWID });
        })

    }
    catch (err) {

      console.log(err);
      res.status(500);
      res.send(err);
    }
  });

  /**
   * Jorge Medina 12/05/2018 Handle 404 requests -> DO NOT REMOVE FROM BOTTOM OF SCRIPT!
   * */
  app.get('*', oidc.ensureAuthenticated(), (req, res) => {
    res.render('404', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
    });
  });


  /**
   * Jorge Medina 12/06/2018 EFT Payload custom field validations
   * */
  function validatePayload(payload) {
    return new Promise((resolve, reject) => {
      var validationErrors = [];
      try {

        //avoid commas in fields
        _.forOwn(payload, (value, key) => {
          if (value && (value.indexOf(',') !== -1 || value.indexOf('#') !== -1 || value.indexOf("'") !== -1 || value.indexOf('"') !== -1)) {
            validationErrors.push({
              field: key,
              msg: 'Invalid Characters found ("," , # , \" or \')'
            });
          }

        });

        //Payee name can’t be empty
        if (validator.isEmpty(payload.payeename, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'payeename',
            msg: 'Cannot be blank'
          });
        }

        //Payee city is required
        if (['US', 'CA'].indexOf(payload.payeecountry) !== -1 && validator.isEmpty(payload.payeecity, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'payeecity',
            msg: 'Cannot be blank'
          });
        }

        //Payee Postal Code is required
        if (['US', 'CA'].indexOf(payload.payeecountry) !== -1 && validator.isEmpty(payload.payeezip, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'payeezip',
            msg: 'Cannot be blank'
          });
        }

        //Payee Country can’t be empty. Use only 2 letters ISO codes, examples: United States = US
        if (!validator.isISO31661Alpha2(payload.payeecountry)) {
          validationErrors.push({
            field: 'payeecountry',
            msg: 'Invalid value, please use only 2 letters ISO codes'
          });
        }


        //Payee State is required. For US and CA, use two letters for states, example: Florida = FL
        if (['US', 'CA'].indexOf(payload.payeecountry) !== -1 && !validator.isLength(payload.payeestate, { min: 2, max: 2 })) {
          validationErrors.push({
            field: 'payeestate',
            msg: 'Use only 2 letter state code'
          });
        }
        else if (['US', 'CA'].indexOf(payload.payeecountry) !== -1 && validator.isEmpty(payload.payeestate, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'payeestate',
            msg: 'Cannot be blank'
          });
        }

        //bank name is required
        if (validator.isEmpty(payload.bankname, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'bankname',
            msg: 'Cannot be blank'
          });
        }


        //bank city cannot be empty
        if (validator.isEmpty(payload.bankcity, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'bankcity',
            msg: 'Cannot be blank'
          });
        }





        //bank country only allows 2 letters ISO codes
        if (!validator.isISO31661Alpha2(payload.bankcountry)) {
          validationErrors.push({
            field: 'bankcountry',
            msg: 'Invalid value, please use only 2 letters ISO codes'
          });
        }

        //Bank Account can’t be empty, is required
        if (validator.isEmpty(payload.account, { ignore_whitespace: true })) {
          validationErrors.push({
            field: 'account',
            msg: 'Cannot be blank'
          });
        }
        //account cannot include special characters
        if (payload.account.indexOf('-') !== -1 || payload.account.indexOf('_') !== -1) {
          validationErrors.push({
            field: 'account',
            msg: 'Invalid characters found ("-" or "_")'
          });
        }

        //Bank State is required. For US and CA, use two letters for states, example: Florida = FL
        if (['US', 'CA'].indexOf(payload.bankcountry) !== -1 && !validator.isLength(payload.bankstate, { min: 2, max: 2 })) {
          validationErrors.push({
            field: 'bankstate',
            msg: 'Use only 2 letter state code'
          });
        }



        //If the Bank Account is international and the country uses IBAN code, the IBAN code must be used, do not include the word IBAN as part of the account number
        if (payload.bankcountry !== 'US' && payload.account.indexOf('IBAN') !== -1) {
          validationErrors.push({
            field: 'account',
            msg: 'Remove word "IBAN" from account number'
          });
        }









        //If Payee Country is not ‘US’ then SWIFT can’t be empty
        if (payload.bankcountry !== 'US' && (validator.isEmpty(payload.swift, { ignore_whitespace: true }))) {
          validationErrors.push({
            field: 'swift',
            msg: 'Swift is required for non US banks'
          });
        }

        //If Payee Country is ‘US’ then Routing number can’t be empty
        if (payload.bankcountry === 'US' && (validator.isEmpty(payload.routing, { ignore_whitespace: true }))) {
          validationErrors.push({
            field: 'routing',
            msg: 'Routing is required for US banks'
          });
        }
        if (payload.bankcountry === 'US' && !(validator.isEmpty(payload.routing, { ignore_whitespace: true })) && !validRoutingNumber(payload.routing)) {
          validationErrors.push({
            field: 'routing',
            msg: 'Invalid routing number'
          });
        }

        //If Payee Country is not ‘US’ then SWIFT can’t be empty
        if (payload.interbankcountry && payload.interbankcountry !== 'US' && (validator.isEmpty(payload.interswift, { ignore_whitespace: true }))) {
          validationErrors.push({
            field: 'interswift',
            msg: 'Swift is required for non US banks'
          });
        }

        //If Payee Country is ‘US’ then Routing number can’t be empty
        if (payload.interbankcountry === 'US' && (validator.isEmpty(payload.interrouting, { ignore_whitespace: true }))) {
          validationErrors.push({
            field: 'interrouting',
            msg: 'Routing is required for US banks'
          });
        }
        if (payload.interbankcountry === 'US' && !(validator.isEmpty(payload.interrouting, { ignore_whitespace: true })) && !validRoutingNumber(payload.interrouting)) {
          validationErrors.push({
            field: 'interrouting',
            msg: 'Invalid routing number'
          });
        }


        //Bank State is required. For US and CA, use two letters for states, example: Florida = FL
        if (['US', 'CA'].indexOf(payload.interbankcountry) !== -1 && !validator.isLength(payload.interbankstate, { min: 2, max: 2 })) {
          validationErrors.push({
            field: 'interbankstate',
            msg: 'Use only 2 letter state code'
          });
        }

        //Payee Country can’t be empty. Use only 2 letters ISO codes, examples: United States = US
        if (payload.interbankcountry && !validator.isISO31661Alpha2(payload.interbankcountry)) {
          validationErrors.push({
            field: 'interbankcountry',
            msg: 'Invalid value, please use only 2 letters ISO codes'
          });
        }

        //If Payee Country is not ‘US’ then SWIFT can’t be empty
        if (payload.interbankname && (validator.isEmpty(payload.interbankcountry, { ignore_whitespace: true }))) {
          validationErrors.push({
            field: 'interbankcountry',
            msg: 'Country required for Intermediary bank'
          });
        }







        resolve(validationErrors);
      }
      catch (err) {
        reject(err);
      }

    });

  }


  function validateVendorPayload(payload) {
    return new Promise((resolve, reject) => {
      var validationErrors = [];
      try {

        //avoid commas in fields
        _.forOwn(payload, (value, key) => {
          if (value && (value.indexOf(',') !== -1 || value.indexOf('#') !== -1 || value.indexOf("'") !== -1 || value.indexOf('"') !== -1)) {
            validationErrors.push({
              field: key,
              msg: 'Invalid Characters found ("," , # , \" or \')'
            });
          }

          if (key !== 'address2' && validator.isEmpty(value, { ignore_whitespace: true })) {
            validationErrors.push({
              field: key,
              msg: 'Cannot be blank'
            });
          }

        });

        if (payload.email1099 && !validator.isEmail(payload.email1099)) {
          validationErrors.push({
            field: 'email1099',
            msg: 'Invalid Email address found'
          });
        }



        resolve(validationErrors);
      }
      catch (err) {
        reject(err);
      }

    });

  }


  /**
   * Jorge Medina 12/06/2018 Helper function to check routing numbers
   */
  function validRoutingNumber(routing) {
    if (routing.length !== 9) {
      return false;
    }
    else {
      return true;
    }
    /*var checksumTotal = (7 * (parseInt(routing.charAt(0), 10) + parseInt(routing.charAt(3), 10) + parseInt(routing.charAt(6), 10))) +
      (3 * (parseInt(routing.charAt(1), 10) + parseInt(routing.charAt(4), 10) + parseInt(routing.charAt(7), 10))) +
      (9 * (parseInt(routing.charAt(2), 10) + parseInt(routing.charAt(5), 10) + parseInt(routing.charAt(8), 10)));

    var checksumMod = checksumTotal % 10;
    if (checksumMod !== 0) {
      return false;
    }
    else {
      return true;
    }*/
  }

  function sendEmail(recipient, id, beneficiary) {
    return new Promise((resolve, reject) => {
      try {
        var transporter = nodemailer.createTransport(config.emailSettings);
        var mailOptions = config.mailOptions;
        mailOptions.to = recipient;
        mailOptions.subject = config.emailTemplate.subject.replace(/<BES>/g, id);
        mailOptions.text = config.emailTemplate.message.replace(/<BES>/g, id).replace(/<BENEFICIARY_NAME>/g, beneficiary).replace(/<FORM_URL>/g, (config.besURL.replace(/<ID>/g, id)));

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            reject();
          }
          else {
            console.log('Email sent: ' + info.response);
            resolve();
          }
        });
      }
      catch (err) {
        console.log(`Error sending email: ${err}`);
        reject();
      }
    });
  }

  /**
   * Promise to push single approved BES to Yardi (BES PUSH API)
   * */
  function pushToYardi(besId) {
    return new Promise((resolve, reject) => {
      try {


        var sqlBes = `
select e1.id, e1.vendorid, e1.paytype || ' : ' || e1.vendorid || '-' ||  e1.payeename || ' ' || e1.forfurthercredit || ' : ' || e1.bankname || '-' || substr(e1.account,-4) sdesc, e1.*
from eftpayee e1
	left join
		(
			select e2.id fk_object_id, max(a.id) fk_faction_id from eftpayee e2
			left join wfaction a on a.fk_object_id = e2.id and a.fk_objtype_id = 1
			group by e2.id
		) z on z.fk_object_id = e1.id
	left join wfaction a2 on a2.id = z.fk_faction_id
	left join wfstep s on s.id = a2.fk_wfstep_id
	WHERE s.id = 5 and s.fk_wf_id = 1 and  e1.id=?
	order by e1.id asc;`;

        var besJSON = new Query(sqlBes, [besId]).all();
        console.log(JSON.stringify(besJSON));
        var options = {
          "method": "POST",
          "hostname": config.bespush.url,
          "path": "/db/bescode",
          "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            'Authorization': 'Basic ' + new Buffer(config.bespush.username + ':' + config.bespush.password).toString('base64')
          }
        };
        var req = https.request(options, (res) => {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            resolve();
          });
        });

        req.write(JSON.stringify(besJSON));
        req.end();
        //req.end(besJSON);
      }
      catch (err) {
        console.log(err);
        reject(err);
      }
    })

  }

};
