var gulp = require ('gulp');


gulp.task ( 'css', function() {
  gulp.src('src/main/resources/css/**')
  .pipe ( gulp.dest( './build/css') );
});
