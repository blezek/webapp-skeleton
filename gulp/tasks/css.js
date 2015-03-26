var gulp = require ('gulp');


gulp.task ( 'css', function() {
  gulp.src('src/app/assets/css/**')
  .pipe ( gulp.dest( './build/css') );
});
