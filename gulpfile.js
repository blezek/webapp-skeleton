/*
  install:
  npm install --save-dev gulp gulp-concat gulp-notify gulp-cache gulp-livereload tiny-lr gulp-util express gulp-browserify
  */


var gulp = require('gulp'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    refresh = require('gulp-livereload'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    lr = require('tiny-lr'),
    express = require('express')


var js = ['js/**/*.js']
var assets = ['assets/**']
var css = ['css/**/*.css']
var dest = 'public'


var vendor = {
  css: ['bower_components/**/*.css'],
  js: ['bower_components/**/*.js']
}


var servers = {
  reload: lr(),
  app: express(),
  port: 4000
};

// Watch these assets
var all = [].concat ( js, assets, css )

gulp.task('build', function() {
    gulp.src(js)
    // .pipe(concat('grater.js'))
    .pipe(gulp.dest(dest+'/js'))
    .pipe(refresh(servers.reload));

    gulp.src(assets)
    .pipe(gulp.dest(dest))
    .pipe(refresh(servers.reload));

    gulp.src(css)
    .pipe(concat('grater.css'))
    .pipe(gulp.dest(dest+'/css'))
    .pipe(refresh(servers.reload));
});

gulp.task('lr-server', function() {
  servers.reload.listen(35729, function(err) {
    if (err) return console.log(err);
  });
});

// Serve the application on the port
gulp.task('express', function() {
   servers.app.use(express.static(dest));
   servers.app.listen(servers.port);
   console.log ("App is ready at: http://localhost:" + servers.port);
});

gulp.task('default', ['lr-server', 'vendor', 'build', 'express'], function() {
  gulp.watch(all, ['build']);
})

gulp.task('vendor', function() {
  
  gulp.src(vendor.css)
  .pipe(gulp.dest('public/css'))

  gulp.src(vendor.js)
  .pipe(gulp.dest('public/js'))

})

