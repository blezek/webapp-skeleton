var gulp = require ('gulp');


gulp.task ( 'html', ['css'], function() {
  gulp.src('src/main/resources/html/**')
  .pipe ( gulp.dest( './build/') );
  gulp.src('src/test/resources/**')
  .pipe ( gulp.dest('./build/data/'));

  //  gulp.src('../X/**').pipe(gulp.dest('./build/X/'))
});
