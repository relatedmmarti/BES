/**
 * A simple web server that initializes the OIDC Middleware library with the
 * given options, and attaches route handlers for the example profile page
 * and logout functionality.
 */

const dbpath = '../db/treasury.db';
const Database = require('better-sqlite3');

const express = require('express'), bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const path = require('path');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const templateDir = path.join(__dirname, '..', 'common', 'views');
const frontendDir = path.join(__dirname, '..', 'common', 'assets');

module.exports = function SampleWebServer(sampleConfig, extraOidcOptions, homePageTemplateName) {

//Database helper
//Takes a sql statement and parameters
//exposes functions to execute queries
  function Query(sql = '', params = {}) {
    var db = new Database(dbpath);

    //return rows as an array of objects
    this.all = function () {
      var rows = db.prepare(sql).all(params);
      //console.log('Query.all: ' + sql);
      //console.log('Query.all: ' + JSON.stringify(params));
      db.close();
      return rows;
    };

    //return single row as an object
    this.get = function () {
      var row = db.prepare(sql).get(params);
      //console.log('Query.get: ' + sql);
      //console.log('Query.get: ' + JSON.stringify(params));
      db.close();
      return row;
    };

    //execute a statement
    this.run = function () {
      var result = db.prepare(sql).run(params);
      //console.log('Query.run: ' + sql);
      //console.log('Query.run: ' + JSON.stringify(params));
      db.close();
      return result;
    };

    //helper function to log requests
    this.audit = function (req = {}, data = {}, status = '') {
      var result = new Query('INSERT INTO auditlog ("action","username","payload","status") values (?,?,?,?);',
        [
          req.method + ' ' + req.url,
          req.userContext.userinfo.preferred_username,
          JSON.stringify(data),
          status
        ]).run();
      db.close();
      return result;
    };

  }

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
    secret: 'this-should-be-very-random',
    resave: true,
    saveUninitialized: false
  }));

  // Provide the configuration to the view layer because we show it on the homepage
  const displayConfig = Object.assign(
    {},
    sampleConfig.oidc,
    {
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

  app.get('/payinfo', oidc.ensureAuthenticated(), (req, res) => {
    res.render('payinfo', {
      isLoggedIn: !!req.userContext.userinfo,
      userinfo: req.userContext.userinfo
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
      limit 1;`,
        [
          username, id, objtype
        ]).get();

      //console.log(CurrentStep);

      if (CurrentStep.approver === username && CurrentStep.id !== 1 && CurrentStep.id !== 4) {
        msg = 'Cannot save changes. Previous approver is the same as current approver (' + username + ')';
        //console.log(msg);
        this.msg = msg;
        return;
      }

      if (CurrentStep.id === 1 && (wfstep === null || wfstep === '')) {
        console.log('Entry step with no next step. Skip validation');
        this.msg = '';
        return;
      }

      if (CurrentStep.authorized_user === null && CurrentStep.id !== 1 && CurrentStep.id !== 4) {
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

  	  //console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);
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
        order by id desc limit 1);`,
        [
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
          'notes') values (?,?,?,?,?);`,
          [
            wfstep,
            objtype,
            id,
            username,
            notes
          ]).run();

        //new Query().audit(req, {'eftpayee: workflow' : payload}, 'valid');
        //console.log(JSON.stringify(this));
        this.msg = ('');

      } else {
        //new Query().audit(req, {'eftpayee: workflow' : payload}, 'error');
        msg = 'Invalid proposed workflow step for item ' + JSON.stringify(this);
        console.log(msg);
        this.msg = (msg);
      }

    } else {
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
  	  console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);
  	  //console.log(payload);
  	  try {
        for (var i = 1; i <= 82; i++) {

          var WorkflowAction = new Query(`
          INSERT INTO wfaction (
            'fk_wfstep_id',
            'fk_objtype_id',
            'fk_object_id',
            'username',
            'notes') values (?,?,?,?,?);`,
            [
              2,
              1,
              i,
              'SYSTEM',
              'import'
            ]).run();

            console.log('WFACTION INJECTED FOR ' + i)

        }
        //console.log(setWorkflow);
  	    res.send({msg: ''});
  	  } catch (err) {

  	      console.log(err);
  	      res.status(500);
  	      res.send(err);
  	  }
    } else {
  	      res.status(401);
  	      res.send('Unauthorized');
    }
  });






  /*====================================================
  Workflow: Get valid next steps for a given object
  */
  app.get('/workflow/:id', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

    if (req.isAuthenticated()) {

      //var payload = req.body;

      var payload = {
        objtype: 1,
      };

  	  console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);
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
        order by id desc limit 1);`,
        [
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

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

    if (req.userContext.userinfo.preferred_username === 'dchin@relatedgroup.com') {

  	  console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

      var del = new Query('DELETE FROM eftpayee WHERE id=?;', [req.params.id]).run();
      //console.log(del);
      del = new Query('DELETE FROM wfaction WHERE fk_object_id=? and fk_objtype_id = 1;', [req.params.id]).run();
      //console.log(del);

      //Write username and data to the audit log
      new Query().audit(req);
      //console.log(del);
      res.send({msg: ''});

    }

    else {
      res.send({msg: '' + req.userContext.userinfo.preferred_username + ' does not have access to delete records.'});
    }

  });





  /*
  ====================================================
  Get a list of all encrypted records for use by TM5
  */
  app.get('/payinfo/bescode/all', (req, res) => {

    res.send('');
  });



  /*
  ====================================================
  Get a list of all BES IDs for consumption by Yardi in the Beneficary segment
  */
  app.get('/payinfo/bescode/segment', (req, res) => {

    res.send('');

  });


    /*
  ====================================================
  Get a single BESCODE record
  */
  app.get('/payinfo/list/bescode/:id', (req, res) => {

    res.send('');

  });



  /*
  ====================================================
  Read records or filter by query string
  */
  app.get('/payinfo/list', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);
    var where = '';

    if (req.query.id !== undefined && req.query.id !== '') {
      where += ' AND e1.rowid=' + req.query.id;
    };
    if (req.query.workflow !== undefined && req.query.workflow !== '') {
      where += ' AND s.name=\'' + req.query.workflow + '\'';
    };
    if (req.query.type !== undefined && req.query.type !== '') {
      where += ' AND e1.paytype=\'' + req.query.type + '\'';
    };
    if (req.query.source !== undefined && req.query.source !== '') {
      where += ' AND e1.sourcesystem=\'' + req.query.source + '\'';
    };
    if (req.query.vendor !== undefined && req.query.vendor !== '') {
      where += ' AND (e1.vendorid like \'%' + req.query.vendor + '%\' or e1.payeename like \'%' + req.query.vendor + '%\')';
    };
    if (req.query.bank !== undefined && req.query.bank !== '') {
      where += ' AND e1.bankname=\'' + req.query.bank + '\'';
    };

    //console.log(where);

    sql = `
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
    var select = new Query(sql).all();
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
      order by id desc limit 1);`,
      [
        objType,
        id
      ]).get();

    if (result === undefined) {
      return {id:null, fk_wf_id:null, name: '(None)', notes:null, modified:null, wfname: 'No Workflow Assigned' };
    } else {
      return result;
    }

  }

  app.get('/payinfo/:id', oidc.ensureAuthenticated(), (req, res) => {

    var objType = 1;

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

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
      order by id desc limit 1);`,
      [
        objType,
        req.params.id
      ]).all();

    //Get the current workflow step for the item
    var currentstep = new CurrentStep(1, req.params.id);

    //Get the current workflow step for the item
    var stephistory = new Query('select a.username, a.notes, a.modified, s.name from wfaction a join wfstep s on s.id = a.fk_wfstep_id where a.fk_object_id = ? order by a.modified desc;', [req.params.id]).all();

    //If no steps came back feed bake a dummy result in
    if (nextsteps === undefined || nextsteps.length === 0) {
      nextsteps = [{id:null, fk_wf_id:null, name:'(None)', notes:null, modified:null, wfname: 'No Workflow Assigned' }];
    } else {
      //add a blank option to the array of valid next steps. This is used to save edits without advancing the workflow
      nextsteps.unshift({id:'', fk_wf_id:'', name:'', notes:'', modified:'', wfname: '' });
    }

    if (currentstep.isapproval === 1) {
      obj.wfstatus = 'Completed';
    } else {
      obj.wfstatus = 'Pending';
    }


    //Wrap everything up into an object to send out
    var payload = {
      obj: obj,
      nextsteps: nextsteps,
      currentstep: currentstep,
      stephistory: stephistory
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

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

    //lazy shortcut
    var payload = req.body;

    //Update workflow first
    var setWorkflow = new WorkflowAction(payload.wf_stepnext, 1, req.params.id, req.userContext.userinfo.preferred_username, payload.wf_notes);

    //console.log(setWorkflow);

    //Only save edits if the workflow is still in progress
    //if (currentstep.isapproval === 1) {
    if (setWorkflow.msg !== '') {
      //res.send({msg: 'Cannot save edits when workflow is complete. Please select a next step to restart.'});
      res.send(setWorkflow);
    } else {

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
        //new Query().audit(req, [{'eftpayee' : payload}, {'workflow' : {}}]);
        new Query().audit(req, [{'eftpayee' : payload}]);

  	    res.send({msg: ''});
  	  } catch (err) {
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
  });














  /*====================================================
  NEW : Create record
  */
  app.post('/payinfo/new', oidc.ensureAuthenticated(), (req, res) => {

    console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);

    if (req.isAuthenticated()) {

  	  var payload = req.body;

  	  console.log(req.method + ' ' + req.url + ' ' + req.userContext.userinfo.preferred_username);
  	  //console.log(payload);

  	  try {
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
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
          [
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
        new Query().audit(req, {'eftpayee' : payload});

        //Set initial workflow step for new record
        var setWorkflow = new WorkflowAction(1, 1, insert.lastInsertROWID, req.userContext.userinfo.preferred_username, payload.wf_notes, true);
        console.log(setWorkflow);

  	    res.send({msg: ''});
  	  } catch (err) {

  	      console.log(err);
  	      res.status(500);
  	      res.send(err);
  	  }
    } else {
  	      res.status(401);
  	      res.send('Unauthorized');
    }
  });





};
