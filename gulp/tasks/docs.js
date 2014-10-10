var gulp = require ( 'gulp' );
var jsdoc = require('gulp-jsdoc');

gulp.task("docs", function() {
  gulp.src("./src/main/javascript/**/*.js")
  .pipe(jsdoc('build/documentation/'));
});
