

// Progress bar functions

module.exports.createViewers = function () {
    var Viewers = {};
    var sliceViewerX = new X.renderer2D();
    sliceViewerX.container = 'sliceX';
    sliceViewerX.orientation = 'X';
    sliceViewerX.init();

    var sliceViewerY = new X.renderer2D();
    sliceViewerY.container = 'sliceY';
    sliceViewerY.orientation = 'Y';
    sliceViewerY.init();

    var sliceViewerZ = new X.renderer2D();
    sliceViewerZ.container = 'sliceZ';
    sliceViewerZ.orientation = 'Z';
    sliceViewerZ.init();
    Viewers.sliceViewerX = sliceViewerX;
    Viewers.sliceViewerY = sliceViewerY;
    Viewers.sliceViewerZ = sliceViewerZ;
    return Viewers;
  }
  
