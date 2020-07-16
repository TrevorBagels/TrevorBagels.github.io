var canv;
var ctx;
var specialmodeindex = 0;
var pixels = [];
var pixels2D = [];
var off = false;
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function GiveHelp() {
  var helptext = "CONTROLS: N/M: Toggle mode. Q/W: Change modifier 1";
  alert(helptext);
}
function dist(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
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
var screenscale = 6;
ctx.canvas.width *= screenscale;
ctx.canvas.height *= screenscale;
// Define the image dimensions
var width = canv.width;
var height = canv.height;
var specialrands = [];
for (var i = 0; i < width * height; i++) {
  specialrands.push(rand(0, 1000) / 1000);
}
var mode = 0;

var currentindex = [0, 0];
function srand(min, max) {
  var indx = currentindex[0] * width + currentindex[1];
  return Math.floor(specialrands[indx] * (max - min + 1) + min);
}
// Create an ImageData object
var imagedata = ctx.createImageData(width, height);

function cot(x) {
  return 1 / Math.tan(x);
}
function toBW(color) {
  var tot = color.r + color.g + color.b;
  return new rgb(tot / 3, tot / 3, tot / 3);
}
var red = 255;
var green = 255;
var blue = 255;
function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.strokeStyle = "rgb(" + red + ", " + green + "," + blue + ")";
  ctx.lineWidth = 1;

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
// Main loop
var ii = 0;
var lastthingy1 = 0;
var donetree = false;
function main(tframe) {
  if (off) return;
  ii += 1;
  // Request animation frames
  window.requestAnimationFrame(main);
  // for (var i = 0; i < 20; i++) {
  //var x = ii + i;
  //Screen.DrawPixel(x, Math.sin(25) + rand(-50, 50));
  //}
  if (mode === 3) {
    var x = width / 2;
    var y = height / 2;
    var j = Math.sin(ii / 100) * 300;
    var newx = x + j;
    var newy = (1 - Math.sin(newx / 10) * 2) * x;
    newx += rand(-100, 100);
    red = (j / 2) * 10;
    green = 0;
    blue = Math.tan(j / 600) * 175;
    line(x, y, newx, newy);
  }
  if (mode === 0 || mode === 2) {
    var x = width / 2;
    var y = height / 2;
    var startingy = y - height / 4 / (1 - (Math.tan(ii / 90) * 2) / 10);
    var xoffset = -ii / 10000 + 500;
    var targety =
      y +
      Clamp(
        (Math.pow(Math.sin(ii / 10) - 2), 2) * 100,
        -(1000 / ii) * 100,
        (1000 / ii) * 100
      );
    green = Math.sin(ii / 10) * 255;
    blue = Math.sin(ii / 12) * 255;
    red = Math.pow(Math.cos(ii), 3) * 100;
    if (mode === 0) {
      line(
        x - width / 4 - xoffset,
        startingy,
        x + Math.sin((y + ii) / 10) * 10,
        targety
      );
      line(
        x + width / 4 + xoffset,
        startingy,
        x + Math.sin((y + ii) / 10) * 10,
        targety
      );
    }
  }
}

var treeheight = 20;
var treelen = 30;
var treetotal = 0;
var maxtrees = 200000;
function treev(x, y) {
  if (treetotal > maxtrees) return;
  treetotal += 1;
  red = 255;
  var newy = y + treeheight;
  var newx = x;
  line(newx, y, x, newy);
  setTimeout(treeh, treetotal, newx, newy, 1);
  setTimeout(treeh, treetotal + 5, newx, newy, -1);
  return;
}
function treeh(x, y, d) {
  treetotal += 1;
  //var newx = (1 + y / 10000) * x + d * treelen;
  var newx = x + d * treelen;
  var a = 1;
  if (d === -1) a = 0;
  var newy = y + 15;
  line(x, y, newx, newy);
  setTimeout(treev, treetotal + 5 + a, newx, newy);
  return;
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
  if (kc.key === "h") GiveHelp();
  if (kc.key === "m") {
    mode += 1;
    Logg("MODE: " + mode);
  }
  if (kc.key == "p") {
    off = true;
    Logg("OFF");
  }
  if (kc.key === "n") {
    mode -= 1;
    Logg("MODE: " + mode);
  }
}

function Clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}
var x0 = width / 4;
//treev(x0, 20);
