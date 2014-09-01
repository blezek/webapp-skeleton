/* Load an MRB file */

var mrb = require ( '../../main/javascript/mrb');
var test = require('tape');
var fs = require('fs');
test('smoke:simple', function (t) {
  t.plan(1);

  var d;
  function testMRB(d) {
    console.log('testing MRB object: ' + d);
    t.equals(Object.keys(d.files).length, 15);
  }

  if ( process.browser ) {
    var JSZipUtils = require('jszip-utils');
    JSZipUtils.getBinaryContent('/build/test/head.mrb', function(err, data) {
      if(err) {
        throw err; // or handle err
      }
      d = mrb.readMRB(data);
      testMRB(d);
    });

  } else {
    var file = __dirname + '/../resources/head.mrb';
    // read a zip file
    fs.readFile(file, function(err, data) {
      if (err) throw err;
      d = mrb.readMRB(data);
      testMRB(d);
    });

  }

});
