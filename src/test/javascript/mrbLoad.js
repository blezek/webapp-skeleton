/* Load an MRB file */

var mrb = require ( '../../main/javascript/mrb');
var test = require('tape');
var loadHelper = require('./loadHelper');

test('mrb:load', function (t) {

  loadHelper.loadHelper('test/resources/head.mrb', function(err,data) {
    t.plan(2);
    d = mrb.readMRB(data);
    t.ok(d, "Loaded MRB");
    t.equals(Object.keys(d.files).length, 15, "Number of files in the MRB file");
  })
});


test('mrb:object', function (t) {

  loadHelper.loadHelper('test/resources/head.mrb', function(err,data) {
    t.plan(2);
    m = new mrb.MRB(data);
    t.ok(m, "Loaded MRB");
    t.equals(m.getModels().length, 10, "Number of models in the MRB file");
  })
});
