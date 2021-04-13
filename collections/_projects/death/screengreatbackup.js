var canv;
var testThing = 10;
var ctx;
var eqLM = 1;
var experimentalEQ;
var experimentalEQ2;
var experimentalEQ3;
var experimentalEQ4;
var experimentalEQ5;
var modeRange = 15;
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
    if (rgbThing == undefined || rgbThing == null)
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
CreatePixels();
// Define the image dimensions
var width = canv.width;
var height = canv.height;
var r1 = Math.round(rand(0, 2));
var r2 = Math.round(rand(0, 2));
var r3 = Math.round(rand(0, 2));
var r4 = Math.round(rand(1, 10));
var r5 = Math.round(rand(2, 48));
var r6 = Math.round(rand(2, 48));
var r7 = Math.round(rand(-1, 2));
var r8 = Math.round(rand(1, 30));
var a1 = 0;
var a2 = 0;
var a3 = 0;
var a4 = 0;
var distort1 = 0.01;
var mode = 10;
var speed = 600;
// Create an ImageData object
var imagedata = ctx.createImageData(width, height);

// Create the image
function createImage(offset, seedThing) {
  // Loop over all of the pixels
  var Border = 0;
  for (var x = 0 + Border; x < width - Border; x++) {
    for (var y = 0 + Border; y < height - Border; y++) {
      // Get the pixel index
      //wave the index thing
      var originalX = x;
      var originalY = y;
      var actualPix = [x, y];
      if (mode === 1) {
        actualPix[0] = y * distort1 * x;
        actualPix[1] = x;
      }
      if (mode === 2) {
        actualPix[0] += actualPix[1] * y + x - actualPix[0] * distort1 * 50;
      }
      if (mode === 3) {
        actualPix[0] *= (actualPix[0] + actualPix[1]) / 2;
        actualPix[1] *= actualPix[0] + distort1 / x;
      }
      if (mode == 8) {
        y += (x / width) * a2 * (height / x);
        a2 += 0.0001 / 7.75;
        x += a2;
      }
      if (mode == 9) {
        x = Math.abs(y - x) * (y / x) * a2;
        a2 += 0.0001 / 20;
      }
      if (mode == 12) {
        x = y + (x * x) / (8 * (1 + a2)) - (x / 6) * (a2 * 1.5);
        actualPix[0] = x;
      }
      if (mode == 13) {
        actualPix[0] = (x * y) / 4;
      }
      if (mode == 11) {
        x = Clamp(
          thingy.customEQ4(r1, r2, r3, x / 2, y / 5, x, x, y, x, 1, 1, 1, 1),
          -100,
          width + 100
        );
        y = Clamp(
          thingy.customEQ5(r1, r2, r3, y / 2, x / 5, x, x, a2, x, 1, 1, 1, 1),
          -100,
          height + 100
        );
      }
      var thingg = [1, 0];
      if (mode === 4) thingg = [0, 1];
      x = Math.round(x);
      y = Math.round(y);
      x = Clamp(x, 0, width - 1);
      y = Clamp(y, 0, width - 1);
      var pixelindex =
        (Clamp(Math.round(actualPix[thingg[0]]), 0, height) * width +
          Clamp(Math.round(actualPix[thingg[1]]), 0, width)) *
        4;

      // Generate a xor pattern with some random noise
      //var red = (x + offset) % 256 ^ (y + offset) % 256;
      //var green = (2 * x + offset) % 256 ^ (2 * y + offset) % 256;
      //var blue = 50 + Math.floor(Math.random() * 100);
      // Rotate the colors
      //blue = (blue + offset) % 256;
      var pix = pixels[pixelindex];
      if (pix == undefined) {
        pix = pixels[rand(0, pixels.length - 1)];
      }
      if (pix == undefined) pix = pixels[0];
      var blue = pix.color.b;
      var red = pix.color.r;
      var green = pix.color.g;
      var red = 0;
      var green = 0;
      var blue = 255 / rand(1, 1.1);
      if ((x + 0) % r6 == r7 || y % 12 == 1) {
        red = 0 + pix.color.r;
        blue = 0;
        green = 255 / rand(1, 1.1);
        if ((y + offset) % r5 == r7) {
          red = 10 * rand(1, 1.1);
          green = 0;
        }
      }
      red = green * blue + offset * offset * Math.atan(rand(-green, blue)) - 50;
      red /= 10;
      if (r4 == 2) {
        var nrgb = toBW(new rgb(red, green, blue));
        var newRGB = [nrgb.r, nrgb.g, nrgb.b];
        red = newRGB[r1];
        blue = newRGB[r2];
        green = newRGB[r3] / Math.sin(r6);
      } else {
        var nrgb = new rgb(red, green, blue);
        var newRGB = [nrgb.r, nrgb.g, nrgb.b];
        red = (newRGB[r1] / r2) * x;
        blue = newRGB[r2] + r6;
        green = newRGB[r3] - r4 * y;
      }
      if (Math.round(rand(1, speed * 1000)) == 5) {
        r1 = Math.round(rand(0, 2));
        r2 = Math.round(rand(0, 2));
        r3 = Math.round(rand(0, 2));
        r5 = Math.round(rand(2, 48));
        r6 = Math.round(rand(2, 48));
        r4 = Math.round(rand(1, 10));
        r7 = Math.round(rand(-1, 2));
        r8 = Math.round(rand(1, 15));
        a1 = 0;
        a2 = 0;
        a3 = 0;
        a4 = 0;
      }

      if (r8 == 12) {
        var red = (x + offset) % (r8 + r6) ^ (y + offset) % (r8 + r6);
        var green = (2 * x + offset) % (r8 + r6) ^ (2 * y + offset) % (r8 + r6);
        var blue = 50 + Math.floor(Math.random() * 100);
        blue = (blue + offset) % 256;
      }
      if (
        pixels2D[x] != null &&
        pixels2D[x][y] != null &&
        pixels2D[x][y].override
      ) {
        red = pixels2D[x][y].color.r;
        blue = pixels2D[x][y].color.b;
        green = pixels2D[x][y].color.g;
      }
      if (r4 == 2) {
        var nrgb = toBW(new rgb(red, green, blue));
        var newRGB = [nrgb.r, nrgb.g, nrgb.b];
        red = newRGB[r1];
        blue = newRGB[r2];
        green = newRGB[r3] / Math.sin(r6);
      }
      if (r4 == r4) {
        //distort
        red = y * -blue + green / x;
        blue == green * x + y / r2;
        green *= blue % y;
      }
      if (mode == 5) {
        red = green;
        blue /= r7 * 10;
        green = blue * red;
      }
      if (mode == 6) {
        a1 += 0.0001;
        red = (a1 / 100) * blue + Math.cbrt(green * green * blue * blue);
      }
      if (mode == 7) {
        red = 0;
        green = x;
        blue = y;
      }
      if (mode == 11) {
        //red = eval(experimentalEQ);
        red = thingy.customEQ(
          r1,
          r2,
          r3,
          r4,
          r5,
          r6,
          a1,
          a2,
          x,
          y,
          red,
          blue,
          green
        );
        green = thingy.customEQ2(
          r1,
          r2,
          r3,
          r4,
          r5,
          r6,
          a1,
          a2,
          x,
          y,
          red,
          blue,
          green
        );
        blue = thingy.customEQ3(
          r1,
          r2,
          r3,
          r4,
          r5,
          r6,
          a1,
          a2,
          x,
          y,
          red,
          blue,
          green
        );
      }
      pixelindex = Clamp(pixelindex, 0, imagedata.data.length + 2);
      // Set the pixel data
      imagedata.data[pixelindex] = red; // Red
      imagedata.data[pixelindex + 1] = green; // Green
      imagedata.data[pixelindex + 2] = blue; // Blue
      imagedata.data[pixelindex + 3] = (y * x) / r4; // Alpha
      x = originalX;
      y = originalY;
    }
  }
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
  for (var i = 0; i < 20; i++) {
    var x = ii + i;
    Screen.DrawPixel(x, Math.sin(25) + rand(-50, 50));
  }
  // Create the image
  createImage(Math.floor(ii / 2));
  // Draw the image data to the canvas
  ctx.putImageData(imagedata, 0, 0);
}

// Call the main loop
main(0);
//};
document.addEventListener("keypress", doThing);
var stopSeedGen = false;
function doThing(kc) {
  console.log(kc.key);
  if (kc.key == "f") {
    speed += 150;
  }
  if (kc.key == "s") {
    stopSeedGen = !stopSeedGen;
    console.log(stopSeedGen);
  }
  if (kc.key == "d") speed -= 150;
  if (kc.key == "u") distort1 -= 0.005;
  if (kc.key == "i") distort1 += 0.005;
  if (kc.key == "m") {
    mode += 1;
    if (mode == modeRange + 1) {
      mode = 1;
    }
    if (mode == 11) {
      console.log("Experimental Mode");
      randIndex2 = 0;
      randIndex = 0;
      if (!stopSeedGen) MakeSeed();
      experimentalEQ = GenerateEQ(
        [
          "r1",
          "r2",
          "r3",
          "r4",
          "r5",
          "r6",
          "a1",
          "a2",
          "x",
          "y",
          "red",
          "blue",
          "green"
        ],
        15,
        8 * eqLM
      );
      experimentalEQ2 = GenerateEQ(
        [
          "r1",
          "r2",
          "r3",
          "r4",
          "r5",
          "r6",
          "a1",
          "a2",
          "x",
          "y",
          "red",
          "blue",
          "green"
        ],
        15,
        8 * eqLM
      );
      experimentalEQ3 = GenerateEQ(
        [
          "r1",
          "r2",
          "r3",
          "r4",
          "r5",
          "r6",
          "a1",
          "a2",
          "x",
          "y",
          "red",
          "blue",
          "green"
        ],
        15,
        8 * eqLM
      );
      experimentalEQ4 = GenerateEQ(
        [
          "r1",
          "r2",
          "r3",
          "r4",
          "r5",
          "r6",
          "a1",
          "a2",
          "x",
          "y",
          "red",
          "blue",
          "green"
        ],
        15,
        5 * eqLM
      );
      experimentalEQ5 = GenerateEQ(
        [
          "r1",
          "r2",
          "r3",
          "r4",
          "r5",
          "r6",
          "a1",
          "a2",
          "x",
          "y",
          "red",
          "blue",
          "green"
        ],
        15,
        5 * eqLM
      );
      eval(
        "thingy.customEQ = function(r1,r2,r3,r4,r5,r6,a1,a2,x,y,red,blue,green) {" +
          "return " +
          experimentalEQ +
          ";};"
      );
      eval(
        "thingy.customEQ2 = function(r1,r2,r3,r4,r5,r6,a1,a2,x,y,red,blue,green) {" +
          "return " +
          experimentalEQ2 +
          ";};"
      );
      eval(
        "thingy.customEQ3 = function(r1,r2,r3,r4,r5,r6,a1,a2,x,y,red,blue,green) {" +
          "return " +
          experimentalEQ3 +
          ";};"
      );
      eval(
        "thingy.customEQ4 = function(r1,r2,r3,r4,r5,r6,a1,a2,x,y,red,blue,green) {" +
          "return " +
          experimentalEQ4 +
          ";};"
      );
      eval(
        "thingy.customEQ5 = function(r1,r2,r3,r4,r5,r6,a1,a2,x,y,red,blue,green) {" +
          "return " +
          experimentalEQ5 +
          ";};"
      );
      console.log("EQ");
    }
    console.log(mode);
  }
  if (kc.key == "n") {
    mode -= 1;
    if (mode == 0) {
      mode = modeRange;
    }
    console.log(mode);
  }
}

function Clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}
function something() {}
var thingy = new something();
thingy.customEQ = function(
  r1,
  r2,
  r3,
  r4,
  r5,
  r6,
  a1,
  a2,
  x,
  y,
  red,
  blue,
  green
) {};
var seedUsed = [];
var seedArr = [];
var randIndex2 = 0;
function MakeSeed() {
  randIndex = 0;
  seedArr = [];
  seedUsed = [];
  for (var i = 0; i < 15 * 5 * 1.5 * eqLM; i++) {
    seedUsed.push(Math.random());
  }
}
function GetSeedSet() {
  console.log("SetSeed([" + seedArr + "]);");
}
function SetSeed(seedArr1) {
  seedArr = seedArr1;
  stopSeedGen = true;
  randIndex2 = 0;
}
var randIndex = 0;
REQ.Rand = function(min, max) {
  randIndex += 1;
  var o = seedUsed[randIndex];
  seedArr.push(o);
  if (!stopSeedGen) return Math.floor(min + o * (max + 1 - min));
  if (stopSeedGen) {
    randIndex2 += 1;
    return Math.floor(min + seedArr[randIndex2 - 1] * (max + 1 - min));
  }
};
