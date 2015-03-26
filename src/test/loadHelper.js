
var fs = require('fs');

module.exports.loadHelper = function(url,callback) {
  if ( process.browser ) {
    var JSZipUtils = require('jszip-utils');
    return JSZipUtils.getBinaryContent('/build/' + url, callback );
  } else {
    var file = __dirname + '/../' + url;
    return fs.readFile(file,callback);
  }
};
