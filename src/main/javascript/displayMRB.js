/* Entry point for the MRB display code.  Uses the same library as the Node program.
*/

var mrb = require('./mrb');
var ui = require('./ui');

var JSZipUtils = require('jszip-utils');

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
  startRenderer ( event.target.files[0] );
});

// Grab a test dataset
// This is just for testing...
if ( false ) {
  var xhr = new XMLHttpRequest();
  var url = 'data/head.mrb';
  console.log("Getting head.mrb...", url);
  xhr.open ( "GET", url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    startRenderer(xhr.response);
  };
  xhr.send();
}

var q = $.deparam.fragment(true);

$("#loader").hide();
var circle = new ProgressBar.Circle("#progress", {
  color: '#fcb03c',
  // strokeWidth: 5.0,
  text: {
    value: 'Loading...',
    color: "#aaa"
  }
});

console.log(q);
if ( q.mrb ) {
  console.log("Got mrb", q.mrb);
  // Here we go

  var loginURL = "http://slicer.kitware.com/midas3/rest/system/login";
  var loginURL = "/midas3/rest/system/login";
  var parameters = {
    appname: "mrml-drop",
    email: "daniel.blezek@gmail.com",
    apikey: "uO0824aTAB7SUhnMQoQYzXxtx2lM1jXt5GwcX1lO"
  };


  $.get(loginURL, parameters)
  .done(function(response){
    console.log("Get login response...", response);

    // Get using jQuery
    console.log("Requesting data...");

    // OK funky, this redirects from a CORS compatable REST url
    // to something that is not...
    var url = "http://slicer.kitware.com/midas3/rest/bitstream/download/206209?token=" + response.data.token;
    url = "/midas3/rest/bitstream/download/206209?token=" + response.data.token;

    // console.log("Requesting via jQuery")
    // $.get( url,function() {
    //   console.log("GET RETURNED!!!")
    // }).done(function(response){
    //   console.log("Got data!");
    // }).fail(function(data){
    //   console.log("error", data);
    // });


    var xhr = new XMLHttpRequest();
    console.log("Getting data by XHR...", url);
    $("#loader").fadeIn();
    circle.set(0.0);

    xhr.open ( "GET", url);
    xhr.responseType = 'blob';
    xhr.onprogress = function (event) {
      if ( event.lengthComputable ) {
        var percentComplete = (event.loaded / event.total );
        // console.log("Progress: " + percentComplete);
        circle.animate(percentComplete);
      }
    };
    xhr.onload = function () {
      circle.animate(0.0);
      startRenderer(xhr.response);
    };
    xhr.send();
  });

}

function startRenderer(file) {

  ui.progress.setProgressText ( "Loading " + file.name + "..." );
  $("#frontpage").fadeOut('slow');
  $("#splash").fadeIn('fast', function() {
  });



  ui.progress.setProgressText("Creating viewers...");
  console.log("Started!");

  $("#viewerContainer").show();
  $("#viewer").show();

  var r = new X.renderer3D();
  r.container = 'viewer';
  r.init();
  // Set the canvas to have a height of 100%
  $("#viewer").children().height('100%');


  function createViewers() {
    var Viewers = {};
    var sliceViewerX = new X.renderer2D();
    sliceViewerX.container = 'sliceX';
    sliceViewerX.orientation = 'X';
    sliceViewerX.init();

    var sliceViewerY = new X.renderer2D();
    sliceViewerY.container = 'sliceY';
    sliceViewerY.orientation = 'Y';
    sliceViewerY.init();

    var sliceViewerZ = new X.renderer2D();
    sliceViewerZ.container = 'sliceZ';
    sliceViewerZ.orientation = 'Z';
    sliceViewerZ.init();
    Viewers.sliceViewerX = sliceViewerX;
    Viewers.sliceViewerY = sliceViewerY;
    Viewers.sliceViewerZ = sliceViewerZ;
    return Viewers;
  }
  
  // Construct the 2d viewers
  var Viewers = createViewers();
  
  var gui = new dat.GUI();
  var cameraOptions = {};
  var cameraChoice = '';
  var options = {
    cameraChoice: cameraChoice,
    sliceViewerVolume: null,
    showSliceView: true,
    volumeChoice: null,
    resetView: function() {
      r.resetViewAndRender();
    }
  };
  var objects = {};



  // Load our MRB file
  var fileReader = new FileReader();
  fileReader.onloadend =  function() {
    var data = fileReader.result;
    d = new mrb.MRB(data);

    mrmlFile = d.getMRMLs()[0];
    mrml = new mrb.MRML(d);

    // console.log ( "display nodes", mrml.getDisplayNodes());
    // console.log ( "model nodes", mrml.getModels());

    var cameras = mrml.getCameras();
    Object.keys(cameras).forEach(function(key){
      var camera = cameras[key];
      // console.log ( 'looking at camera', camera );
      if (camera.hideFromEditors === "false") {
        cameraOptions[camera.name] = key;
      }
    });

    // Give us some cameras
    var controlsFolder = gui.addFolder('Display Settings');

    var control = controlsFolder.add ( options, 'cameraChoice', cameraOptions );
    control.onFinishChange(function(value) {
      // console.log ( "selected camera: ", value);
      var camera = cameras[value];
      r.camera.position = camera.position.split( " " );
      r.camera.focus = camera.focalPoint.split( " " );
      r.camera.up = camera.viewUp.split(" ");
    });

    controlsFolder.open();

    // Toggle showing labels
    var hover = controlsFolder.add ( r.interactor.config, "HOVERING_ENABLED");
    hover.name = "captions";

    // Show / hide 2d display
    var showSliceViewController = controlsFolder.add ( options, 'showSliceView' );

    // Reset view
    controlsFolder.add(options, 'resetView');


    showSliceViewController.onFinishChange(function(value){
      var updateCanvas = function() {
        console.log ( "Making progress!" );
        // Need to send a fake resize event to keep XTK changing
        // the canvas sizes
        // $(window).resize();
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false,window,0);
        window.dispatchEvent(evt);
      };

      if ( value ) {
        console.log("Showing slices");
        $(".sliceDisplay").show('fast');
        $("#viewer").animate({height: '70%'}, {
          duration: 'fast',
          progress: updateCanvas
        });
      } else {
        console.log("Hiding slices");
        $(".sliceDisplay").hide('fast');
        $("#viewer").animate({height: '100%'}, {
          duration: 'fast',
          progress: updateCanvas
        });
      }
    });


    var modelFolder = gui.addFolder ( "Models" );
    var models = mrml.getModels();

     Object.keys(models).forEach(function(key){
      var model = models[key];
      if ( !model.file ) {
        console.log ( "Can not load model file for " + key + " could not find file: " + model.storage.fileName, model);
        // Return from the callback
        return;
      }
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

      var folder = modelFolder.addFolder(model.name);
      folder.add ( mesh, 'visible' );
      folder.add ( mesh, 'opacity', 0, 1.0 );

    });

    // Add a list of volume data, the GUI must be deferred until after
    // the data is loaded, so construct a map of our images
    var deferredVolumeGUI = {};
    var images = d.getImages();
    var lastVolume = null;

    Object.keys(images).forEach(function(key){
      var image = images[key];
      console.log("Got an image!", image);
      var volume = new X.volume();
      volume.file = image;
      volume.filedata = d.getFile(image).asArrayBuffer();

      var displayName = image.split("/").pop();
      console.log("Display name: " + displayName);
      if ( !displayName ) {
        displayName = key;
      }

      deferredVolumeGUI[displayName] = volume;
      volume.visible = true;
      // r.add(volume);
      lastVolume = displayName;
    });


    r.camera.position = [0, 400, 0];

    // Show the name of the moused over object
    r.render();
    gui.open();
    ui.progress.setProgressText("Spinning Z axis...");
    ui.progress.setProgress( 100 );

    r.onShowtime = function() {

      // var volumeFolder = gui.addFolder("Volumes");

      // var gotFirst = false;
      // console.log ("Deferred: Building volume GUI...");
      var volumeChoices = [];
      Object.keys(deferredVolumeGUI).forEach(function(key){

        var displayName = key.split("/").pop();
        console.log("Display name: " + displayName);
        if ( !displayName ) {
          displayName = key;
        }
        volumeChoices.push ( displayName );

        // var volume = deferredVolumeGUI[key];
      //   var folder = volumeFolder.addFolder(displayName);
      //   folder.add(volume, 'volumeRendering');
      //   folder.add(volume, 'opacity', 0.0, 1.0);
      //   // folder.add(volume, 'indexX', 0, volume.range[0] - 1).listen();
      //   // folder.add(volume, 'indexY', 0, volume.range[1] - 1).listen();
      //   // folder.add(volume, 'indexZ', 0, volume.range[2] - 1).listen();
      //   folder.add(volume, 'lowerThreshold', volume.min, volume.max);
      //   folder.add(volume, 'upperThreshold', volume.min, volume.max);

      });

      // hook up the 2d viewers to the volume...
      options.volumeChoice = lastVolume;
      var volumeSelector = controlsFolder.add ( options, 'volumeChoice', volumeChoices );

      // To change volumes in the 2d viewers:
      // 1. Destroy the 2D renderers
      //    The do not handle switching volumes very well
      // 2. Only 1 renderer get the volume at first
      //    It must load it, then add to the other renderers
      //    XTK does not handle a volume being loaded by multiple
      //    renderers.
      // 3. Setup the onShowtime callback before calling render
      var change = function(key){
        var value = deferredVolumeGUI[key];

        Viewers.sliceViewerX.destroy();
        Viewers.sliceViewerY.destroy();
        Viewers.sliceViewerZ.destroy();
        Viewers = createViewers();
        
        Viewers.sliceViewerX.add(value);
        Viewers.sliceViewerX.onShowtime = function() {
            Viewers.sliceViewerY.add(value);
            Viewers.sliceViewerY.render();
            Viewers.sliceViewerZ.add(value);
            Viewers.sliceViewerZ.render();
        };
        Viewers.sliceViewerX.render();
      };
      volumeSelector.onFinishChange(change);
      console.log("Last volume", lastVolume);
      if ( lastVolume !== null ) {
        console.log("Hooking up 2d views", lastVolume);
        change(lastVolume);
        // sliceViewerX.add(lastVolume);
        // sliceViewerX.render();
      }
      $("#splash").fadeOut();


    };

    // Finally, fade out the spinner, because we are fully loaded
    $("#loader").fadeOut();

  };

  fileReader.onprogress = function(event) {
    if ( event.lengthComputable ) {
      var percentage = Math.round(100 * event.loaded / event.total);
      ui.progress.setProgressText ("Loading " + percentage + "%" );
      ui.progress.setProgress( percentage );

    }
  };
  fileReader.readAsBinaryString(file);


}
