var mrb = require ( '../../main/javascript/mrb');
var test = require('tape');
var loadHelper = require('./loadHelper');

test('vtk:convert', function (t) {

  loadHelper.loadHelper('test/resources/head.mrb', function(err,data) {
    t.plan(4);
    m = new mrb.MRB(data);
    mrml = new mrb.MRML(m);
    t.ok(mrml, "Loaded MRML");
    t.ok(mrml.cameras, "Cameras");
    t.equals(Object.keys(mrml.cameras).length, 10, "Number of cameras");

    t.equals(Object.keys(mrml.getModels()).length, 10, "Number of models");

  });
});
