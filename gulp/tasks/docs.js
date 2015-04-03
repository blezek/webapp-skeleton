var gulp = require ( 'gulp' );
var jsdoc = require('gulp-jsdoc');

gulp.task("docs", function() {
  gulp.src("./src/app/**/*.js")
  .pipe(jsdoc('build/documentation/'));
});
