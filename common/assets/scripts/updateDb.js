const Query = require('./query.js');

var statements = [{
    statement: 'CREATE TABLE eftattach (`id` INTEGER, `filename` TEXT,`dateadded` TEXT, `dateupdated` TEXT, `datedeleted` TEXT, `user` TEXT,PRIMARY KEY(`id`,`filename`));',
    param: []
  },
  {
    statement: `insert into wfstep ('id', 'fk_wf_id','name','notes','isfirst','isapproval','modified') values (?,?,?,?,?,?,?);`,
    param: [6, 1, 'Inactive', '', '', '', '2018-10-05 17:19:04']
  }, {
    statement: `insert into wfstepnext ('id', 'fk_wfstep_id', 'fk_step_id_next', 'sort', 'notes', 'modified') values (?,?,?,?,?,?);`,
    param: [12, 1, 6, , , '2018-10-05 17:19:40']
  },
  {
    statement: `insert into wfstepnext ('id', 'fk_wfstep_id', 'fk_step_id_next', 'sort', 'notes', 'modified') values (?,?,?,?,?,?);`,
    param: [13, 2, 6, , , '2018-10-05 17:19:40']
  },
  {
    statement: `insert into wfstepnext ('id', 'fk_wfstep_id', 'fk_step_id_next', 'sort', 'notes', 'modified') values (?,?,?,?,?,?);`,
    param: [14, 3, 6, , , '2018-10-05 17:19:40']
  },
  {
    statement: `insert into wfstepnext ('id', 'fk_wfstep_id', 'fk_step_id_next', 'sort', 'notes', 'modified') values (?,?,?,?,?,?);`,
    param: [15, 4, 6, , , '2018-10-05 17:19:40']
  }, {
    statement: `insert into wfstepnext ('id', 'fk_wfstep_id', 'fk_step_id_next', 'sort', 'notes', 'modified') values (?,?,?,?,?,?);`,
    param: [16, 6, 1, , , '2018-10-05 17:19:40']
  }
]

try {
  statements.forEach((statement) => {
    new Query(statement.statement, statement.param).run();
  })
  process.exit();
}
catch (err) {
  console.log(`Update DB failed with error: ${err.toString()}`);
  process.exit(-1);
}
