/* Entry point for the MRB display code.  Uses the same library as the Node program.
*/

var mrb = require('./mrb');
var JSZipUtils = require('jszip-utils');
var retact = require('./ui/redact.js');


var dropzone = new Dropzone(document.body, {
  url: "ignored",
  previewsContainer: false,
  createImageThumbnails: false,
  dictDefaultMessage: ""
});
dropzone.on('addedfile', function(file){
  $('#frontpage').hide();
  startRenderer(file);
});

$("#file").change(function(event) {
  console.log ( "on change!!!", event)
  startRenderer ( event.target.files[0] );
})


var q = URI.parseQuery(location.search);
console.log(q);
q.mrb = true
if ( q.mrb ) {
  console.log("Got mrb", q.mrb);
  // Here we go

  var loginURL = "http://slicer.kitware.com/midas3/rest/system/login";
  var parameters = {
    appname: "mrml-drop",
    email: "daniel.blezek@gmail.com",
    apikey: "uO0824aTAB7SUhnMQoQYzXxtx2lM1jXt5GwcX1lO"
  };


  $.get(loginURL, parameters)
  .done(function(response){
    console.log("Get login response...", response);

    // Get using jQuery
    console.log("Requesting data...")

    // OK funky, this redirects from a CORS compatable REST url
    // to something that is not...
    $.get( "http://slicer.kitware.com/midas3/rest/bitstream/download/206209?token=" + response.data.token,parameters).done(function(response){
      console.log("Got data!");
    });


    // var xhr = new XMLHttpRequest();
    // var url = q.mrb + "?token=" + response.data.token;
    // console.log("Getting data...", url);
    // xhr.open ( "GET", url);
    // xhr.responseType = 'blob';
    // xhr.onload = function () {
    //   startRenderer(xhr.response);
    // }
    // xhr.send();
  });

}

function startRenderer(file) {

  $("#frontpage").hide();

  console.log("Started!");
  var r = new X.renderer3D();
  r.init();


  var gui = new dat.GUI();
  var cameraOptions = {};
  var cameraChoice = '';
  var options = { cameraChoice: cameraChoice };
  var objects = {};

  // Simply show all the mesh files based on the models in the scene
  var displayModel = function ( model ) {

  };


  // Load our MRB file
  var fileReader = new FileReader();
  fileReader.onloadend =  function() {
    var data = fileReader.result;
    d = new mrb.MRB(data);

    mrmlFile = d.getMRMLs()[0];
    mrml = new mrb.MRML(d);

    console.log ( "display nodes", mrml.getDisplayNodes());
    console.log ( "model nodes", mrml.getModels());

    var cameras = mrml.getCameras();
    Object.keys(cameras).forEach(function(key){
      var camera = cameras[key];
      console.log ( 'looking at camera', camera );
      if (camera.hideFromEditors === "false") {
        cameraOptions[camera.name] = key;
      }
    });
    // Give us some cameras
    var control = gui.add ( options, 'cameraChoice', cameraOptions );
    control.onFinishChange(function(value) {
      console.log ( "selected camera: ", value);
      var camera = cameras[value];
      r.camera.position = camera.position.split( " " );
      r.camera.focus = camera.focalPoint.split( " " );
      r.camera.up = camera.viewUp.split(" ");
    })


    // Toggle showing labels
    var hover = gui.add ( r.interactor.config, "HOVERING_ENABLED");
    hover.name = "captions"
    console.log ( hover );


    var models = mrml.getModels();

     Object.keys(models).forEach(function(key){
      var model = models[key];
      var mesh = new X.mesh();

      mesh.file = model.storage.fileName;
      mesh.filedata = model.file.asArrayBuffer();

      mesh.lineWidth = parseInt ( model.display.lineWidth );
      mesh.pointSize = parseInt ( model.display.pointSize );
      mesh.visible = model.display.visibility && true;
      mesh.opacity = parseInt ( model.display.opacity );
      mesh.color = model.display.color.split(" ");
      mesh.caption = model.name;
      r.add(mesh);

      objects[mesh.id] = model;

      var folder = gui.addFolder(model.name);
      folder.add ( mesh, 'visible' );
      folder.add ( mesh, 'opacity', 0, 1.0 );

    });


    // var mesh = new X.mesh();
    // mesh.file = 'data/skull_bone.vtk.vtk.vtk';

    // mesh.filedata = d.convertVTKToASCII ( d.getModel ( 'head/Data/skull_bone.vtk.vtk.vtk' ) );
    // var parser = new X.parser();
    // parser.parse(null, mesh, mesh, null);

    // console.log('We set the data to', mesh.filedata)
    // r.add(mesh);
    r.camera.position = [0, 400, 0];

    // Show the name of the moused over object


    r.render();

    gui.open();
  }


  fileReader.readAsBinaryString(file);


}
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
