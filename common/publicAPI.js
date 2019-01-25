/* Public facing API, basic auth over HTTPS*/

const express = require('express');
const app = express();
const port = 8081;
const basicAuth = require('express-basic-auth');
const Query = require('./bessync_query');
const bodyParser = require('body-parser');


app.use(express.urlencoded());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
})); //todo: move this to a key file
app.use(basicAuth({
  users: { 'bes.rg.systems': 'ff7a1c2dcca0be07f1be4ef82fec454193a6dc638f54983946905ee3ee14bc17' },
  challenge: true
}));

app.get('/api', (req, res) => {
  console.log(req.method + ' ' + req.url + ' ' + req.headers['x-real-ip']);
  res.send('api running');
});


/*
====================================================
Get a Transaction
*/
app.get('/pending/:id', (req, res) => {

  console.log(req.method + ' ' + req.url + ' ' + req.headers['x-real-ip']);

  var result = new Query(`
    select id, payload from bestransaction
    where completed is null and processing <>'Y' and id=?
      order by datecreated asc limit 1;`, [
    req.params.id
  ]).get();
  res.json(result);
});


/*
====================================================
Update a Transaction
*/
app.post('/update/:id', (req, res) => {

  console.log(req.method + ' ' + req.url + ' ' + req.headers['x-real-ip']);
  try {
    var update = new Query(`UPDATE bestransaction
         SET processing='N',
          completed = ?,
          completeddate=?,
          log=?
      WHERE
            id=?;`, [
      req.body.completed,
      new Date().toLocaleDateString(),
      req.body.logs,
      req.params.id
    ]).run();
    res.status(200).send({ msg: '' })
  }
  catch (err) {
    res.status(200).send({ msg: 'Error: ' + err });
  }
});






app.listen(port, () => console.log(`Public API listening on ${port}!`));
