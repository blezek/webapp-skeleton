var gulp = require ('gulp');


gulp.task ( 'html', function() {
  gulp.src('src/main/resources/html/**')
  .pipe ( gulp.dest( './build/') );
});
