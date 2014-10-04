var DOMParser = require ( 'xmldom' ).DOMParser;

module.exports.MRML = function ( mrb ) {
  this.mrb = mrb;

  var toObject = function (node) {
    var a = {};
    for ( var i = 0; i < node.attributes.length; ++i ) {
      var attribute = node.attributes[i];
      a[attribute.nodeName] = attribute.nodeValue;
    }
    return a;
  };

  // Find the MRML file
  var mrml = this.mrb.getFile(this.mrb.getMRMLs()[0]);

  // Parse the XML
  var parser = new DOMParser();
  this.xml = parser.parseFromString(mrml.asText(),"text/xml");

  this.cameras = {};
  var c = this.xml.getElementsByTagName ( "Camera" );
  console.log("Found " + c.length + " cameras");
  for ( var i = 0; i < c.length; ++i ) {
    var camera = toObject ( c[i] );
    console.log(camera);
    this.cameras[camera.id] = camera;
  }

  var displayNodes = {};
  c = this.xml.getElementsByTagName ( "ModelDisplay" );
  console.log("Found " + c.length + " ModelDisplay");
  for ( i = 0; i < c.length; ++i ) {
    var md = toObject ( c[i] );
    displayNodes[md.id] = md;
  }

  this.models = {};
  c = this.xml.getElementsByTagName ( "Model" );
  console.log("Found " + c.length + " Models");
  for ( i = 0; i < c.length; ++i ) {
    var model = toObject ( c[i] );
    model.display = displayNodes[model.displayNodeRef];
    this.models[model.id] = model;
  }



  /**
  * Get the models.
  * @return list of models
  */
  this.getModels = function () {
    return this.models;
  };

  /**
  * Get the list of cameras.
  * @return list of cameras
  */
  this.getCameras = function() {
    return this.cameras;
  };
};
