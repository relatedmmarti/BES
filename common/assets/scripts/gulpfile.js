var gulp = require('gulp');
var exec = require('gulp-exec');
var confirm = require('gulp-confirm');

/*
updates the database
*/


gulp.task('default', ['initdb']);

gulp.task('initdb', function () {

  var options = {
    continueOnError: false,
    pipeStdout: false,
    customTemplatingThing: 'initdb'
  };

  var reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  };

  gulp.src('./')
    .pipe(confirm({
      question: ' This script will update the database schema.\n\n CONTINUE?  [y/n]  ',
      input: '_key:y'
    }))
    .pipe(exec('node updateDb.js', options))
    .pipe(exec.reporter(reportOptions));
});
