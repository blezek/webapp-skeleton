var JSZip = require ( 'jszip' );


module.exports.readMRB = function ( buffer ) {
  var zip = new JSZip(buffer);
  // console.log(zip.files);
  for( file in zip.files ) {
    // console.log(file);
  }
  console.log('returnning zip ' + zip);
  return zip;
}
