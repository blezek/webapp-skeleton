var JSZip = require ( 'jszip' );


module.exports.readMRB = function ( buffer ) {
  var zip = new JSZip(buffer);
  return zip;
}
