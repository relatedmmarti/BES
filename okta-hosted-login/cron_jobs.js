var CronJob = require('cron').CronJob;
var exec = require('child_process').exec;

new CronJob('0 23 * * *', function () {
  console.log('running backup start ');
  var cmd = 'node azure_backups.js';
  exec(cmd, function (error, stdout, stderr) {
    if (error) { console.log('backup error' + error); }
    else
      console.log('backup ran succesfully');
  })
}, null, true, 'America/Los_Angeles');
