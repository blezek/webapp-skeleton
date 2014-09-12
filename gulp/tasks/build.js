/*
  Build everything related to this project.
*/

var gulp = require('gulp');

gulp.task('build', ['browserify', 'html', 'tests']);
