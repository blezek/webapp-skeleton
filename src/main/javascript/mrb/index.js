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


if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

// Return an array with the first element being
function findString ( buffer, start ) {
  var index = start;
  var c = buffer[index];
  var s = [];
  while ( c != 10 ) {
    s.push ( String.fromCharCode ( c ));
    index++;
    c = buffer[index];
  }
  return { "start": start,
    "end": index,
    "next": index + 1,
    "string": s.join('')
  };
}

  /**
  * Convert a Binary VTK model to an ASCII Model
  */
  this.convertVTKToASCII = function ( data ) {
    var buffer = data.asUint8Array();
    var dataView = new DataView ( data.asArrayBuffer() );
    // Going to make a big array of strings
    var vtk = [];
    var index = 0;
    while(true) {

      // Get a string
      var state = findString ( buffer, index );
      line = state.string;
console.log("Starting convert line: " + line)

      if ( line.startsWith ( "POINTS") ) {
        vtk.push ( line );
        // Add the points
        var numberOfPoints = parseInt ( line.split(" ")[1] );
        // Each point is 3 4-byte floats
        var count = numberOfPoints * 4 * 3;
        console.log ( "Found " + numberOfPoints + " points");

        var pointIndex = state.next;
        for ( var i = 0; i < numberOfPoints; i++ ) {
        var pt = [dataView.getFloat32(pointIndex, false),
          dataView.getFloat32(pointIndex + 4, false),
          dataView.getFloat32(pointIndex + 8, false)];
          vtk.push ( pt.join(" "));
          pointIndex = pointIndex + 12;
        }
        // increment our next pointer
        state.next = state.next + count + 1;
      } else if ( line.startsWith ( "TRIANGLE_STRIPS") ) {
        vtk.push(line);

        var numberOfStrips = parseInt ( line.split(" ")[1]);
        var size = parseInt ( line.split ( " " )[2]);
        // 4 byte integers
        var count = size * 4;
        console.log ( "Found TriangleStrips " + numberOfStrips + " strips total");

        var pointIndex = state.next;
        for ( var i = 0; i < numberOfStrips; i++ ) {
          // For each strip, read the first value, then record that many more points
          var indexCount = dataView.getInt32(pointIndex, false);
          var strip = [indexCount];
          pointIndex += 4;
          for ( var s = 0; s < indexCount; s++ ) {
            strip.push ( dataView.getInt32(pointIndex,false));
            pointIndex += 4;
          }
          vtk.push ( strip.join(" ") );
        }
        // increment our next pointer
        state.next = state.next + count + 1;
      } else if ( line.startsWith ( "POINT_DATA")) {
        vtk.push(line);
        var numberOfPoints = parseInt ( line.split(" ")[1]);

        // Grab the next line
        state = findString ( buffer, state.next );
        vtk.push(state.string);
        // Now grab the binary data
        var count = numberOfPoints * 4 * 3;
        pointIndex = state.next;
        console.log("POINT_DATA, found " + numberOfPoints + " and skipping " + count);
        for ( var i = 0; i < numberOfPoints; i++ ) {
          var pt = [dataView.getFloat32(pointIndex, false),
          dataView.getFloat32(pointIndex + 4, false),
          dataView.getFloat32(pointIndex + 8, false)];
          vtk.push ( pt.join(" "));
          pointIndex += 12;
        }


        // Increment past our data
        state.next = state.next + count;

      } else {
        vtk.push ( line );
      }

      // Increment index
      index = state.next;
      if ( index >= buffer.byteLength) {
        break;
      }

      console.log("new index is: " + index + " line was: " + state.string );

    }
    var s = vtk.join('\n');
    console.log ( "Final string is " + s.length);
    var uintArray = new Uint8Array(s.length);
    for ( var i = 0, j = s.length; i < j; ++i ) {
      uintArray[i] = s.charCodeAt(i);
    }
    return uintArray;
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
