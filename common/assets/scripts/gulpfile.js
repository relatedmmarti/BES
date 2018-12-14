const gulp = require('gulp');
const exec = require('gulp-exec');
const confirm = require('gulp-confirm');
const minify = require('gulp-minify');

/*
updates the database
*/


gulp.task('default', ['compress']);

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


/**
 * Jorge Medina 12/12/2018 -> Gulp Task to minimize js
 * */
gulp.task('compress', function () {
  gulp.src(['../js/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('../minjs/'))
});
