/* Entry point for the MRB display code.  Uses the same library as the Node program.
*/

var mrb = require('./mrb');
var JSZipUtils = require('jszip-utils');

console.log("Started!");
var r = new X.renderer3D();
r.init();

// Load our MRB file
JSZipUtils.getBinaryContent('data/head.mrb', function(err,data) {
  var d = new mrb.MRB(data);
  console.log ( d.getModels() )
  console.log ( "Got", d.getModel ('head/Data/skull_bone.vtk.vtk.vtk' ));
  var mesh = new X.mesh();
  mesh.file = 'data/skull_bone.vtk.vtk.vtk';

  mesh.filedata = d.convertVTKToASCII ( d.getModel ( 'head/Data/skull_bone.vtk.vtk.vtk' ) );
  // var parser = new X.parser();
  // parser.parse(null, mesh, mesh, null);

  // console.log('We set the data to', mesh.filedata)
  r.add(mesh);
  r.camera.position = [0, 400, 0];


  // create a cube
  cube = new X.cube();

  // setting the edge length can also be skipped since 20 is the default
  cube.lengthX = cube.lengthY = cube.lengthZ = 20;

  // can also be skipped since [0,0,0] is the default center
  cube.center = [0, 0, 0];

  // [1,1,1] (== white) is also the default so this can be skipped aswell
  cube.color = [1, 1, 1];

  r.add(cube); // add the cube to the renderer

  r.render();

} );

//
// // create a cube
//   cube = new X.cube();
//
//   // setting the edge length can also be skipped since 20 is the default
//   cube.lengthX = cube.lengthY = cube.lengthZ = 20;
//
//   // can also be skipped since [0,0,0] is the default center
//   cube.center = [0, 0, 0];
//
//   // [1,1,1] (== white) is also the default so this can be skipped aswell
//   cube.color = [1, 1, 1];
//
//   r.add(cube); // add the cube to the renderer
//   r.render(); // ..and render it
