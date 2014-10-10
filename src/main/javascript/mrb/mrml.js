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

  var getNodes = function ( xml, name ) {
    var nodes = {};
    var c = xml.getElementsByTagName ( name );

    for ( var i = 0; i < c.length; ++i ) {
      var md = toObject ( c[i] );
      nodes[md.id] = md;
    }
    return nodes;
  };

  // Find the MRML file
  var mrmlFilename = this.mrb.getMRMLs()[0];
  this.baseDirectory = mrmlFilename.substr(0, mrmlFilename.indexOf("/"));

  var mrml = this.mrb.getFile(mrmlFilename);

  // Parse the XML
  var parser = new DOMParser();
  this.xml = parser.parseFromString(mrml.asText(),"text/xml");

  this.cameras = getNodes ( this.xml, "Camera");
  this.storageNodes = getNodes(this.xml, "ModelStorage");

  this.displayNodes = getNodes ( this.xml, "ModelDisplay" );

  this.models = getNodes ( this.xml, "Model" );
  var self = this;
  // Link the models together
  Object.keys(this.models).forEach(function(key){
    var model = self.models[key];
    model.display = self.displayNodes[model.displayNodeRef];
    model.storage = self.storageNodes[model.storageNodeRef];
    model.file = self.mrb.getModel ( self.baseDirectory + '/' + model.storage.fileName );
  });

  /**
  * Get the list of display nodes.
  * @returns display nodes found in the MRML file
  */
  this.getDisplayNodes = function() {
    return this.displayNodes;
  };

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
