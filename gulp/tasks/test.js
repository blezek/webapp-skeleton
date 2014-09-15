/* Run all the tests using the testem test runner. */

var gulp = require('gulp');
var testem = require('testem');

gulp.task('test', ['tests'], function() {
  var opts = {
    file: 'testem.json',
    port: 16743
  };
  var t = new testem();
  return t.startCI(opts);
});
