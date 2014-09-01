var unzip = require ( 'unzip' );


function readMRB ( stream ) {
  stream.pipe(unzip.Parse())
  .on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;
    console.log ( "Found a " + type + " named " + filename + " of size " + size );
    entry.autodrain();
  });
}
