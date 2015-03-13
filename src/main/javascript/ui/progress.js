

// Progress bar functions

module.exports.setProgressText = function(text) {
  $("#progress_text").text(text);
};

// Set the value of the progress bar as a percentage
module.exports.setProgress = function ( value ) {
  $("#progress_bar").width(value+"%");
  $("#progress_bar").text(value + "%");
};

