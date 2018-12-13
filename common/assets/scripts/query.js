module.exports =
  //Database helper
  //Takes a sql statement and parameters
  //exposes functions to execute queries
  function Query(sql = '', params = {}) {

    const dbpath = '../../../db/treasury.db';
    const Database = require('better-sqlite3');

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
    this.audit = function (req = {}, data = {}, status = '', id = null, objtype = null) {
      var result = new Query('INSERT INTO auditlog ("action","username","payload","status","fk_id","objtype") values (?,?,?,?,?,?);', [
        req.method + ' ' + req.url,
        req.userContext.userinfo.preferred_username,
        JSON.stringify(data),
        status,
        id,
        objtype
      ]).run();
      db.close();
      return result;
    };

  };
