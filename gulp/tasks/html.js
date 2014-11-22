var gulp = require ('gulp');


gulp.task ( 'html', ['css'], function() {
  gulp.src('src/main/resources/html/**')
  .pipe ( gulp.dest( './build/') );

  gulp.src('src/test/resources/**')
  .pipe ( gulp.dest('./build/data/'));

  gulp.src(['node_modules/dat-gui/vendor/dat*.js'])
  .pipe ( gulp.dest('./build/js/'));

  // "Vendor" packages
  // Bootstrap
  gulp.src(['node_modules/bootstrap/dist/**'])
  .pipe ( gulp.dest('./build'));

  // Font Awesome
  gulp.src(['node_modules/font-awesome/fonts/**'])
  .pipe( gulp.dest('./build/fonts'));
  gulp.src(['node_modules/font-awesome/css/**'])
  .pipe( gulp.dest('./build/css'));

  // JQuery
  gulp.src(['node_modules/jquery/dist/**'])
  .pipe( gulp.dest('./build/js'));

  // Dropzone file upload
gulp.src(['node_modules/dropzone/downloads/*js'])
.pipe(gulp.dest('./build/js'));
gulp.src(['node_modules/dropzone/downloads/css/**'])
.pipe(gulp.dest('./build/css'));
gulp.src(['node_modules/dropzone/downloads/images/**'])
.pipe(gulp.dest('./build/images'));
});
