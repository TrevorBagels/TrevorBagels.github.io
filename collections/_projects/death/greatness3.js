var canv;
var ctx;
var specialmodeindex = 0;
var pixels = [];
var pixels2D = [];
function CreatePixels() {
  for (var i = 0; i < canv.clientWidth; i++) {
    pixels2D.push([]);
    for (var ii = 0; ii < canv.clientHeight; ii++) {
      new Pixel(i, ii);
    }
  }
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function Pixel(x, y) {
  pixels2D[x].push(this);
  pixels.push(this);
  this.x = x;
  this.y = y;
  this.color = new rgb(0, 0, 0);
  this.on = 0;
}
var rgb = function(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.str = function() {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
  };
};
function AverageColor() {
  var r = 0;
  var g = 0;
  var b = 0;
  for (var i = 0; i < width * height; i++) {
    r += imagedata.data[i * 4 + 0];
    g += imagedata.data[i * 4 + 1];
    b += imagedata.data[i * 4 + 2];
  }
  return r / (width * height) + g / (width * height) + b / (width * height);
}
var Screen = {
  DrawPixel: function(x, y, rgbThing) {
    if (rgbThing === undefined || rgbThing == null)
      rgbThing = new rgb(255, 255, 255);
    if (x < 0 || x > pixels2D.length - 1 || y < 0 || y > pixels2D[0].length - 1)
      return;
    if (pixels2D[x] != null && pixels2D[x][y] != null) {
      pixels2D[x][y].color = rgbThing;
      pixels2D[x][y].override = true;
    }
  }
};

// The function gets called when the window is fully loaded
//window.onload = function() {
// Get the canvas and context
canv = document.getElementById("canvas");
ctx = canv.getContext("2d");
var screenscale = 4;
ctx.canvas.width *= screenscale;
ctx.canvas.height *= screenscale;
CreatePixels();
// Define the image dimensions
var width = canv.width;
var height = canv.height;
var r = [];
for (var i = 0; i < 20; i++) {
  r.push(rand(0, 1000) / 1000);
}
var iterations = 0;
var currentindex = [0, 0];
function srand(min, max) {
  var indx = currentindex[0] * width + currentindex[1];
  return Math.floor(specialrands[indx] * (max - min + 1) + min);
}
// Create an ImageData object
var imagedata = ctx.createImageData(width, height);

// Create the image
function createImage(offset, seedThing) {
  // Loop over all of the pixels
  var Border = 0;
  iterations += 1;
  if (iterations > 1000) iterations = 0;
  currentindex = [0, 0];
  var randomi = rand(1, 1000);
  for (var x = 0 + Border; x < width - Border; x++) {
    currentindex[0] = x;
    var randomx = rand(1, 1000);
    for (var y = 0 + Border; y < height - Border; y++) {
      currentindex[1] = y;
      // Get the pixel index
      //wave the index thing
      var originalX = x;
      var originalY = y;
      var actualPix = [x, y];
      var thingg = [1, 0];
      x = Math.round(x);
      y = Math.round(y);
      x = Clamp(x, 0, width - 1);
      y = Clamp(y, 0, height - 1);
      var pixelindex =
        (Clamp(Math.round(actualPix[thingg[0]]), 0, height) * width * views2 +
          Clamp(Math.round(actualPix[thingg[1]]), 0, width)) *
        views;
      var pix = pixels[pixelindex];
      if (pix == undefined)
        pix = pixels[0];
      //ALWAYS
      var red = 0;
      var green = 0;
      var blue = 0;
      if (writenewpix) {
        pixelindex = Clamp(pixelindex, 0, imagedata.data.length + 2);
        // Set the pixel data
        imagedata.data[pixelindex] = red; // Red
        imagedata.data[pixelindex + 1] = green; // Green
        imagedata.data[pixelindex + 2] = blue; // Blue
        pix.color = new rgb(red, green, blue);
        //vignette
        // Alpha
        imagedata.data[pixelindex + 3] = 255;
      }

      x = originalX;
      y = originalY;
    }
  }
}
function cot(x) {
  return 1 / Math.tan(x);
}
function toBW(color) {
  var tot = color.r + color.g + color.b;
  return new rgb(tot / 3, tot / 3, tot / 3);
}
// Main loop
var ii = 0;
function main(tframe) {
  ii += 1;
  // Request animation frames
  window.requestAnimationFrame(main);
  // for (var i = 0; i < 20; i++) {
  //var x = ii + i;
  //Screen.DrawPixel(x, Math.sin(25) + rand(-50, 50));
  //}
  // Create the image
  createImage(Math.floor(ii / 2));
  // Draw the image data to the canvas
  ctx.putImageData(imagedata, 0, 0);
}

// Call the main loop
main(0);
//};
function Logg(txt) {
  window.document.title = txt;
}

document.addEventListener("keypress", doThing);
function doThing(kc) {
  console.log(kc.key);
}

function Clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}
