var JSZip = require ( 'jszip' );
var utils = require ('../utils');

/** The MRB class.
* @class
*/
module.exports.MRB = function ( buffer ) {
  this.zip = new JSZip(buffer);

  /** Get the models from the MRB file
  * @returns a list of models from the MRB
  */
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

/**
 * Get a particular model.
 * @returns a model as a ZipObject
 */
  this.getModel = function (name) {
    return this.zip.file(name);
  }
};

/** This is the readMRB function
* @param {buffer} a buffer containing on MRB file.
* @returns a zip object representating the MRB.
 */
module.exports.readMRB = function ( buffer ) {
  var zip = new JSZip(buffer);
  return zip;
}
