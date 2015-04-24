var gulp = require ('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


gulp.task ( 'javascript', function() {
  // Build any Javascript here
  browserify('./src/app/listMRB.js')
  .bundle()
  .pipe(source('listMRB.js'))
  .pipe(gulp.dest('./build/js/'));

  // Build the display app
  browserify('./src/app/displayMRB.js')
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js/'));
});
