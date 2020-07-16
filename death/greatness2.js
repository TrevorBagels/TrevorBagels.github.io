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
function closeTo(value, target, range) {
  if (range === undefined) {
    range = 15;
  }
  if (value < target + range && value > target - range) return true;
  return false;
}
function Pixel(x, y) {
  pixels2D[x].push(this);
  pixels.push(this);
  this.override = false;
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
var specialrands = [];
for (var i = 0; i < width * height; i++) {
  specialrands.push(rand(0, 1000) / 1000);
}
var scale = 3;
var mode = 0;
var buildingAmt = 20 * scale;
var buildingWidth = 30 * scale;
var buildingHeight = 100 * scale;
var a5 = 0; //max = 360, min = -360.
var a5speed = 1;
var a5dir = 1;
var views = 4;
var views2 = 1;
var freezed = false;
var noise = true;
var bandw = false;
var iterations = 0;
var currentindex = [0, 0];
function srand(min, max) {
  var indx = currentindex[0] * width + currentindex[1];
  return Math.floor(specialrands[indx] * (max - min + 1) + min);
}
// Create an ImageData object
var imagedata = ctx.createImageData(width, height);
var buildings = [];
var b2 = [];
for (var i = 0; i < width; i++) {
  buildings.push(0);
  b2.push(0);
}
//create 10 - 20 buildings
for (var i = 0; i < rand(0, buildingAmt); i++) {
  //create building. Use random x value
  var x = rand(0, width);
  var w = rand(10, buildingWidth);
  var h = rand(buildingHeight / 16, buildingHeight);
  for (var z = 0; z < w; z++) {
    buildings[Clamp(Math.floor(z + x), 0, width - 1)] = h;
  }
}
for (
  var i = 0;
  i < rand((width / buildingWidth) * 2, (width / buildingWidth) * 6);
  i++
) {
  var x = rand(0, width);
  var w = rand(6, buildingWidth / 1.5);
  var h = rand(0, 88) * scale;
  if (h < 15) w = w * 8 * scale;
  for (var z = 0; z < w; z++) {
    b2[Clamp(Math.floor(z + x), 0, width - 1)] = h;
  }
}
var cars = [];
var carpixels = [];
for (var i = 0; i < width; i++) carpixels.push(0);
for (var i = 0; i < 40; i++) {
  //initx, dir, y value, distance traveled
  var dirs = [-1, 1];
  cars.push([
    Math.floor(rand(0, width)),
    Math.floor(dirs[Math.floor(rand(0, 2))]),
    rand(40, 100) * scale,
    0
  ]);
}
// Create the image
function createImage(offset, seedThing) {
  if (iterations > 2 && iterations < 128) {
    for (var i in cars) {
      cars[i][3] += cars[i][1];
      carpixels[Math.floor(cars[i][0] + cars[i][3])] = cars[i][2];
    }
  }
  // Loop over all of the pixels
  if (freezed) return;
  var Border = 0;
  iterations += 1;
  a5 += a5dir * a5speed;
  if (a5 > 1) a5dir = -1;
  if (a5 < -1) a5dir = 1;
  currentindex = [0, 0];
  var randomi = rand(1, 1000);
  for (var x = 0 + Border; x < width - Border; x++) {
    currentindex[0] = x;
    var randomx = rand(1, 1000);
    for (var y = 0 + Border; y < height - Border; y++) {
      currentindex[1] = y;
      if (freezed) return;
      // Get the pixel index
      //wave the index thing
      var originalX = x;
      var originalY = y;
      var actualPix = [x, y];

      var thingg = [1, 0];
      x = Math.round(x);
      y = Math.round(y);
      x = Clamp(x, 0, width - 1);
      y = Clamp(y, 0, width - 1);
      var pixelindex =
        (Clamp(Math.round(actualPix[thingg[0]]), 0, height) * width * views2 +
          Clamp(Math.round(actualPix[thingg[1]]), 0, width)) *
        views;
      var pix = pixels[pixelindex];
      if (pix === undefined) {
        pix = pixels[0];
        if (noise) pix = pixels[rand(0, pixels.length - 1)];
      }
      if (pix === undefined) pix = pixels[0];
      //ALWAYS
      var red = 0;
      var green = 0;
      var blue = 0;
      var writenewpix = true;
      var keepoldpix = true;
      if (specialmodeindex === 1) keepoldpix = true;
      if (keepoldpix) {
        blue = pix.color.b;
        red = pix.color.r;
        green = pix.color.g;
      }
      var skyred = 100 - y + rand(1, 3);
      var skyblue = 100 - y / 1.5 + rand(1, 3);
      var skygreen = 2 * (x / 50) + rand(1, 2);
      if (iterations < 3) {
        red = skyred;
        blue = skyblue;
        green = skygreen;
      }
      if (iterations < 128) {
        //create moon
        var moonsize = 60;
        var moonx = width / 2;
        var moony = 40;
        var originaly = y;
        var originalx = x;
        y = Math.sin(x) + y;
        x =
          Math.sin(y + iterations / 8) * Math.sin(iterations / 10 + 10) * 4 + x;
        //create distance 0-1
        //var d = Math.sqrt(Math.pow(moonx - x, 2) + Math.pow(moony - y, 2))
        var d =
          Math.sqrt(0 + Math.pow(width + height, 2)) /
          Math.sqrt(Math.pow(moonx - x, 2) * Math.pow(moony - y, 2));
        if (mode === 0) {
          red = (((d * moonsize) / 20) * Math.abs(x * 1.5 - width / 2)) / 12;
          blue = (moonsize / d) * (12 / Math.abs(x - width / 2));
          green = d - y / 32;
        }

        y = originaly;
        x = originalx;
      }
      if (!closeTo(red, skyred, 4))
        if (iterations > 4 && iterations < 128) {
          red = (skyred + red / 1.05) / 2;
          blue = (skyblue + blue / 1.05) / 2;
          green = (skygreen + green / 1.15) / 2;
        }
      if (iterations > 2 && iterations < 128) {
        //add cars
        if (carpixels[x] != 0)
          if (closeTo(y, carpixels[x], 0.2)) {
            red = 230;
            blue = 230;
            green = 230;
          }
      }
      if (iterations > 2 && iterations < 128) {
        //create buildingsc
        if (buildings[x] > height - y) {
          red = 0;
          green = 0;
          blue = 0;
          if (
            x > 0 &&
            x < width &&
            buildings[x - 1] === buildings[x] &&
            buildings[x + 1] === buildings[x]
          )
            if (y % 4 === 0) {
              red = 240 + rand(1, 9);
              blue = 220 + rand(1, 9);
              green = 240 + rand(1, 9);
            }
        }
        if (b2[x] > height - y) {
          red = 0;
          green = 0;
          blue = 0;
        }
      }
      //B&W
      if (bandw) {
        var bw = (red + blue + green) / 3;
        red = bw + 20;
        blue = bw;
        green = bw + 10;
      }
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
