/* Public facing API, basic auth over HTTPS*/

const express = require('express');
const app = express();
const port = 8081;
const basicAuth = require('express-basic-auth');

var Query = require('../common/query.js');

app.use(basicAuth({
  users: { 'bes.rg.systems': 'ff7a1c2dcca0be07f1be4ef82fec454193a6dc638f54983946905ee3ee14bc17' },
  challenge: true
}));

app.get('/', (req, res) => res.send(''));

/*
====================================================
Get a list of all approved records for use by TM5
*/
app.get('/bescode/approved', (req, res) => {

  console.log(req.method + ' ' + req.url + ' ' + req.headers['x-forwarded-for']);

  var sql = `
select e1.* from eftpayee e1
	left join
		(
			select e2.id fk_object_id, max(a.id) fk_faction_id from eftpayee e2
			left join wfaction a on a.fk_object_id = e2.id and a.fk_objtype_id = 1
			group by e2.id
		) z on z.fk_object_id = e1.id
	left join wfaction a2 on a2.id = z.fk_faction_id
	left join wfstep s on s.id = a2.fk_wfstep_id
	WHERE s.id = 5 and s.fk_wf_id = 1
	order by e1.id desc;`;

  //get each object and the workflow step
  var select = new Query(sql).all();
  res.json(select);
});



/*
====================================================
Get a list of all BES IDs for consumption by Yardi in the Beneficary segment
*/
app.get('/bescode/segment', (req, res) => {

  var sql = `
select e1.id, e1.vendorid, e1.paytype || ' : ' || e1.vendorid || '-' ||  e1.payeename || ' ' || e1.forfurthercredit || ' : ' || e1.bankname || '-' || substr(e1.account,-4) sdesc
from eftpayee e1
	left join
		(
			select e2.id fk_object_id, max(a.id) fk_faction_id from eftpayee e2
			left join wfaction a on a.fk_object_id = e2.id and a.fk_objtype_id = 1
			group by e2.id
		) z on z.fk_object_id = e1.id
	left join wfaction a2 on a2.id = z.fk_faction_id
	left join wfstep s on s.id = a2.fk_wfstep_id
	WHERE s.id = 5 and s.fk_wf_id = 1
	order by e1.id asc;`;

  var select = new Query(sql).all();
  res.json(select);

});

/*
====================================================
Get ALL records
*/
app.get('/bescode/', (req, res) => {

  console.log(req.method + ' ' + req.url + ' ' + req.headers['x-forwarded-for']);

  var sql = `
select e1.* from eftpayee e1
	left join
		(
			select e2.id fk_object_id, max(a.id) fk_faction_id from eftpayee e2
			left join wfaction a on a.fk_object_id = e2.id and a.fk_objtype_id = 1
			group by e2.id
		) z on z.fk_object_id = e1.id
	left join wfaction a2 on a2.id = z.fk_faction_id
	left join wfstep s on s.id = a2.fk_wfstep_id
	order by e1.id desc;`;

  //get each object and the workflow step
  var select = new Query(sql).all();
  res.json(select);

});

/*
====================================================
Get a single BESCODE record
*/
app.get('/bescode/:id', (req, res) => {

  res.send('');

});

app.listen(port, () => console.log(`Public API listening on ${port}!`));
