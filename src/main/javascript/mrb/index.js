var JSZip = require ( 'jszip' );
var utils = require ('../utils');

module.exports.MRB = function ( buffer ) {
  this.zip = new JSZip(buffer);

  // Get the models from the MRB file
  this.getModels = function () {
    var models = [];
    console.log(this.zip);
    for ( var key in this.zip.files) {
      console.log("Key: " + key);
      if (utils.endsWith(key,".vtk")) {
        models.push(key);
      }
    }
    return models;
  };

};

/** This is the readMRB function */
module.exports.readMRB = function ( buffer ) {
  var zip = new JSZip(buffer);
  return zip;
}
