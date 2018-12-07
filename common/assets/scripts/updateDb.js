const Query = require('./query.js');

var statements = [{
    statement: 'DELETE FROM eftpayee WHERE id=?;',
    param: ['204']
  },
  {
    statement: 'DELETE FROM wfaction WHERE fk_object_id=?;',
    param: ['204']
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
