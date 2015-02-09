var gulp = require ('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify     = require('reactify');  // Transforms React JSX to JS.


gulp.task ( 'javascript', function() {
  // Build any Javascript here
  browserify('./src/main/javascript/listMRB.js')
  .transform(reactify)
  .bundle()
  .pipe(source('listMRB.js'))
  .pipe(gulp.dest('./build/js/'));

  // Build the display app
  browserify('./src/main/javascript/displayMRB.js')
  .transform(reactify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js/'));
});
