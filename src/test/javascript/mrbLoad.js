/* Load an MRB file */

var mrb = require ( '../../main/javascript/mrb');
var test = require('tape');
var loadHelper = require('./loadHelper');

test('smoke:simple', function (t) {

  loadHelper.loadHelper('test/resources/head.mrb', function(err,data) {
    t.plan(2);
    d = mrb.readMRB(data);
    t.ok(d, "Loaded MRB");
    t.equals(Object.keys(d.files).length, 15, "Number of files in the MRB file");
  })
});
