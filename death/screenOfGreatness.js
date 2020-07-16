var canv;
var ctx;
var enablelegacymodes = true;
var modeRange = 15;
var paused = false;
var specialmodes = ["normal", "city"];
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
  if (range == undefined) {
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
CreatePixels();
// Define the image dimensions
var width = canv.width;
var height = canv.height;
var specialrands = [];
for (var i = 0; i < width * height; i++) {
  specialrands.push(rand(0, 1000) / 1000);
}
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
var distort1 = 0.01;
var mode = 3;
var speed = 600;
var citydata = { cloudpoints: [] };
function srand(min, max) {
  var indx = currentindex[0] * width + currentindex[1];
  return Math.floor(specialrands[indx] * (max - min + 1) + min);
}
// Create an ImageData object
var imagedata = ctx.createImageData(width, height);

// Create the image
function createImage(offset, seedThing) {
  // Loop over all of the pixels
  if (freezed) return;
  if (mode === 6) a5speed = 0.0015;
  var Border = 0;
  iterations += 0.001;
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
      //NORMAL
      if (specialmodeindex === 0) {
        if (mode === 1) {
          y =
            y *
            Math.sin(
              x * (distort1 * ((x / width) * 2) * 10 * (1 + iterations / 400))
            );
          actualPix[0] = x;
          actualPix[1] = y;
        }
        if (mode === 2) {
          x = (x * y) / (((x + y) / 2) * (distort1 * 4 + 1));
          y += Math.sin(iterations * iterations);
          actualPix[0] = x;
          actualPix[1] = y;
        }
        if (mode === 3) {
          actualPix[0] = (x * randomi) / 100 + randomx / 900;
          actualPix[1] = y;
        }
        if (mode === 4) {
          if (iterations === 0.002) {
            iterations = rand(0, 1000) / 1000;
          }
          y = Math.PI * x * Math.tan(iterations);
          actualPix[0] = x;
          actualPix[1] = y;
        }
        if (mode === 5) {
          y = Math.sin((x + r5) * (r8 / 3)) * (iterations * 100 * r4) + 100;
          actualPix[0] = x;
          actualPix[1] = y;
        }
        if (mode === 7) {
          y += (x % 6) * r8 * 800 * iterations;
          actualPix[0] = x;
          actualPix[1] = y;
        }
        if (mode === 6) {
          y = Math.sin(x * 4) * (iterations * 100 * r4) + 100;
          x -= width / 2;
          y -= height / 2;
          var a = a5 * 10;
          var s = Math.sin(a);
          var c = Math.cos(a);
          actualPix[0] = x * c - y * s + width / 2;
          actualPix[1] = x * s + y * c + height / 2;
          y = actualPix[1];
          x = actualPix[0];
        }
      } //normal^^
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
      var keepoldpix = false;
      if (specialmodeindex === 1) keepoldpix = true;
      if (keepoldpix) {
        blue = pix.color.b;
        red = pix.color.r;
        green = pix.color.g;
      }
      //NORMAL
      if (specialmodeindex == 0)
        if (noise) {
          blue = 255 / rand(1, 1.1);
        }
      //CITY
      if (specialmodeindex === 1) {
        //CREATE BACKGROUND
        if (y < 100 && !citydata.cloudpoints.includes(y + "," + x)) {
          red = y + 60;
          blue = 50 * (255 / y);
          green = 10;
        }
        //CREATE CLOUDS AND STUFF
        if (y > 20 && y < 60) {
          if ((rand(0, 30) + x) % 40 == 1) {
            citydata.cloudpoints.push(y + "," + x);
            red = ((red + green + blue) / 3) * 1.25;
            blue = (red + blue) / 2;
            green = red;
          }
        }
      }
      //NORMAL___
      if (specialmodeindex === 0) {
        if (enablelegacymodes)
          if ((x + 0) % r6 === r7 || y % 12 === 1) {
            red = 0 + pix.color.r;
            blue = 0;
            green = 255 / rand(1, 1.1);
            if ((y + offset) % r5 === r7) {
              red = 10 * rand(1, 1.1);
              green = 0;
            }
          }
        if (enablelegacymodes) {
          red =
            green * blue + offset * offset * Math.atan(rand(-green, blue)) - 50;
          red /= 10;
        }
        var nrgb;
        var newRGB;
        if (enablelegacymodes) {
          if (r4 === 2) {
            nrgb = toBW(new rgb(red, green, blue));
            newRGB = [nrgb.r, nrgb.g, nrgb.b];
            red = newRGB[r1];
            blue = newRGB[r2];
            green = newRGB[r3] / Math.sin(r6);
          }
          if (r4 === 3) {
            nrgb = new rgb(red, green, blue);
            newRGB = [nrgb.r, nrgb.g, nrgb.b];
            red = (newRGB[r1] + newRGB[r2] + newRGB[r3]) / 3;
            blue = red / r1;
            green = red / r3;
          }
          if (r4 >= 4 && r4 <= 7) {
            newRGB = [red, green, blue];
            var t213 = [x, y];
            if (r4 === 4)
              newRGB[r2] = newRGB[r2] * (t213[Clamp(r3, 0, 1)] / 2550);
            if (r4 === 5) {
              newRGB[r1] =
                ((newRGB[r1] + newRGB[r2]) / 2) * (1 + iterations * 100);
            }
            red = newRGB[0];
            green = newRGB[1];
            blue = newRGB[2];
          } else {
            nrgb = new rgb(red, green, blue);
            newRGB = [nrgb.r, nrgb.g, nrgb.b];
            red = (newRGB[r1] / r2) * x;
            blue = newRGB[r2] + r6;
            green = newRGB[r3] - r4 * y;
          }
        }
        if (r8 === 12 && enablelegacymodes) {
          red = (x + offset) % (r8 + r6) ^ (y + offset) % (r8 + r6);
          green = (2 * x + offset) % (r8 + r6) ^ (2 * y + offset) % (r8 + r6);
          blue = 50 + Math.floor(Math.random() * 100);
          blue = (blue + offset) % 256;
        }

        //mode color changing
        if (mode === 1) {
          if (closeTo(y, Math.sin(x), 20)) {
            red = red * (x * (iterations * 10 + 1));
            green = green * (1 + iterations);
            blue = blue * (y * (iterations * 10 + 2));
          }
        }
        if (mode === 6) {
          var x2 = width / 2;
          var y2 = height / 2;
          var d =
            Math.sqrt(width * width + height * height) /
            10 /
            Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
          red /= d;
          green /= d * 2;
          blue /= d;
        }
      }
      //NORMAL ^^^
      //change everything
      if (Math.round(rand(1, speed * 1000)) === 5 && !paused) {
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
        if (mode != 6) iterations = 0;
        citydata = {cloudpoints: []}
      }
      /*
      if (
        pixels2D[x] != null &&
        pixels2D[x][y] != null &&
        pixels2D[x][y].override
      ) {
        red = pixels2D[x][y].color.r;
        blue = pixels2D[x][y].color.b;
        green = pixels2D[x][y].color.g;
      }*/
      //BLACK AND WHITE MODE
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
        //vignette
        if (!noise) imagedata.data[pixelindex + 3] = (y * x) / r4;
        // Alpha
        else imagedata.data[pixelindex + 3] = 255;
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
var modvars = ["r1", "r2", "r3", "r4", "r7", "r8"];
var modvarindex = 0;
document.addEventListener("keypress", doThing);
function doThing(kc) {
  console.log(kc.key);
  if (kc.key === "t") {
    modvarindex -= 1;
    if (modvarindex === -1) modvarindex = modvars.length - 1;
    Logg("MODVAR (use U/I): " + modvars[modvarindex]);
  }
  if (kc.key === "y") {
    modvarindex += 1;
    if (modvarindex >= modvars.length) modvarindex = 0;
    Logg("MODVAR (use U/I): " + modvars[modvarindex]);
  }
  if (kc.key === "u" || kc.key === "i") {
    var x = -1;
    var mvrs = [r1, r2, r3, r4, r7, r8];
    if (kc.key === "i") x = 1;
    if (modvarindex === 0) r1 = Clamp(r1 + x, 0, 2);
    if (modvarindex === 1) r2 = Clamp(r2 + x, 0, 2);
    if (modvarindex === 2) r3 = Clamp(r3 + x, 0, 2);
    if (modvarindex === 3) r4 += x;
    if (modvarindex === 4) r7 += x;
    if (modvarindex === 5) r8 += x;
    Logg(modvars[modvarindex] + ": " + mvrs[modvarindex]);
  }
  if (kc.key === "z") {
    specialmodeindex += 1;
    if (specialmodeindex >= specialmodes.length) {
      specialmodeindex = 0;
    }
    Logg(specialmodes[specialmodeindex].toUpperCase());
  }
  if (kc.key === "w") {
    speed += 150;
    Logg("UPSPEED: " + speed);
  }
  if (kc.key == 0) {
    enablelegacymodes = !enablelegacymodes;
    Logg("LIG: " + enablelegacymodes);
  }
  if (kc.key === "q") {
    speed -= 150;
    Logg("DOWNSPEED: " + speed);
  }
  if (kc.key == 9) {
    noise = !noise;
    Logg("VIGNETTE: " + !noise);
  }
  if (kc.key == 8) {
    paused = !paused;
    Logg("PAUSED: " + paused);
  }
  if (kc.key === "`") {
    freezed = !freezed;
    Logg("FREEZE: " + freezed);
  }
  if (kc.key == 7) {
    bandw = !bandw;
    Logg("B/W: " + bandw);
  }
  if (kc.key === "e") distort1 -= 0.005;
  if (kc.key === "r") distort1 += 0.005;
  if (kc.key === "e" || kc.key === "r") {
    Logg("DISTORT LEVEL: " + distort1);
  }
  if (kc.key === "m") {
    mode += 1;
    if (mode === modeRange + 1) {
      mode = 1;
    }
    console.log(mode);
    Logg("MODE: " + mode);
  }
  if (kc.key == 6) {
    var v = 4;
    if (views == 4) v = 2;
    if (views == 2) v = 1;
    if (views == 1) v = 6;
    if (views == 6) v = 8;
    if (views == 8) v = 16;
    if (views == 16) v = 4;
    views = v;
    Logg("VIEW LEVEL: " + v);
  }
  if (kc.key == 5) {
    var v = 1;
    if (views2 === 1) v = 0.5;
    if (views2 === 0.5) v = 1;
    if (views2 === 0.5) v = 0.15;
    if (views2 === 0.15) v = 2;
    if (views2 === 2) v = 6;
    if (views2 === 6) v = 1;
    views2 = v;
    Logg("SECOND VIEW LEVEL: " + v);
  }
  if (kc.key == "n") {
    mode -= 1;
    if (mode == 0) {
      mode = modeRange;
    }
    console.log(mode);
    Logg("MODE: " + mode);
  }
}

function Clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}
