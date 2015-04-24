/* Entry point for the MRB display code.  Uses the same library as the Node program.
*/

var mrb = require('./mrb');
var ui = require('./ui');
var dat = require('dat-gui');

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


  // Construct the 2d viewers
  var Viewers = ui.viewers.createViewers();
  
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

    var mrml = new mrb.MRML(d);

    var cameras = mrml.getCameras();
    Object.keys(cameras).forEach(function(key){
      var camera = cameras[key];
      if (camera.hideFromEditors === "false") {
        cameraOptions[camera.name] = key;
      }
    });

    // Give us some cameras
    var controlsFolder = gui.addFolder('Display Settings');

    var control = controlsFolder.add ( options, 'cameraChoice', cameraOptions );
    control.onFinishChange(function(value) {
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
        // Need to send a fake resize event to keep XTK changing
        // the canvas sizes
        // $(window).resize();
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false,window,0);
        window.dispatchEvent(evt);
      };

      if ( value ) {
        $(".sliceDisplay").show('fast');
        $("#viewer").animate({height: '70%'}, {
          duration: 'fast',
          progress: updateCanvas
        });
      } else {
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
      lastVolume = displayName;
    });


    r.camera.position = [0, 400, 0];

    ui.progress.setProgressText("Spinning Z axis...");
    ui.progress.setProgress( 100 );
    r.render();
    gui.open();

    r.onShowtime = function() {
      var volumeChoices = [];
      Object.keys(deferredVolumeGUI).forEach(function(key){

        var displayName = key.split("/").pop();
        console.log("Display name: " + displayName);
        if ( !displayName ) {
          displayName = key;
        }
        volumeChoices.push ( displayName );

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
        Viewers = ui.viewers.createViewers();
        
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
      
      if ( lastVolume !== null ) {
        change(lastVolume);
      }


    };

    // Finally, fade out the progressbar, because we are fully loaded
    $("#splash").fadeOut();
  };

  fileReader.onprogress = function(event) {
    if ( event.lengthComputable ) {
      var percentage = Math.round(100 * event.loaded / event.total);
      ui.progress.setProgressText (percentage + "%" );
      ui.progress.setProgress( percentage );
    }
  };
  fileReader.readAsBinaryString(file);


}



// Load based on URL fragment
var hashChange = function() {
  console.log ( "in hashChange: " + window.location.hash);
  if ( window.location.hash ) {
    
    // Here we go
    var url = window.location.hash.substring(1);
    var xhr = new XMLHttpRequest();
    console.log("Getting data by XHR...", url);

    xhr.open ( "GET", url);
    xhr.responseType = 'blob';
    xhr.onprogress = function (event) {
      if ( event.lengthComputable ) {
        var percentComplete = Math.round( 100 * event.loaded / event.total );
        ui.progress.setProgressText("Download: " + percentComplete + "%" );
        ui.progress.setProgress( percentComplete );
      }
    };
    xhr.onload = function () {
      console.log(xhr);
      console.log(xhr.status);
      if ( xhr.status != 200 ) {
        ui.progress.setProgressText("Download failed: " + xhr.statusText);
        alert("Download failed.\nClick 'OK' to reload.");
        location.assign(location.origin + location.pathname);
      } else {
        startRenderer(xhr.response);
      }
    };

    ui.progress.setProgressText ( "Loading " + file.name + "..." );
    $("#frontpage").fadeOut('slow');
    $("#splash").fadeIn('fast', function() {
    });

    ui.progress.setProgressText("Creating viewers...");

    
    xhr.send();
  }
};
window.onhashchange = hashChange;
hashChange();

// Lastly, try to load example data
$.get ( "example-data/examples.txt" )
  .done(function(data) {
    $("#example-datasets").fadeIn();
  });
