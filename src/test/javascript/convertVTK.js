var mrb = require ( '../../main/javascript/mrb');
var test = require('tape');
var loadHelper = require('./loadHelper');

test('vtk:convert', function (t) {

  loadHelper.loadHelper('test/resources/head.mrb', function(err,data) {
    t.plan(2);
    m = new mrb.MRB(data);
    t.ok(m, "Loaded MRB");
    data = m.getModel("head/Data/skull_bone.vtk.vtk.vtk");
    var ascii = m.convertVTKToASCII(data);
    t.ok(ascii, "Convert to VTK ASCII format");
  });
});
