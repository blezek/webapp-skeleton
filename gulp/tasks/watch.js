/*
  Watch directories and rebuild as needed.

  gulp.watch monitors all files given by the glob pattern
  and runs the tasks when any file changes.
*/

var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {

  // no need to watch our Javascript, browserify takes care of that
  gulp.watch(['src/**/*.js', 'src/**/*.html', 'src/**/*.css', 'gulp/**/*.js'], ['build', 'tests', 'jshint', 'docs']);

});
