function rgb(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.color = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
}

function Distance(p1, p2) {
  var a = p1[0] - p2[0];
  var b = p1[1] - p2[1];
  return Math.sqrt(a * a + b * b);
}

function AddVectors(pos1, pos2) {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
}
function SubtractVectors(pos1, pos2) {
  return [pos1[0] - pos2[0], pos1[1] - pos2[1]];
}
function LerpVectors(pos, targetPos, f) {
  return [Lerp(pos[0], targetPos[0], f), Lerp(pos[1], targetPos[1], f)];
}

function RgbToStr(rgbValue) {
  return "rgb(" + rgbValue.r + "," + rgbValue.g + "," + rgbValue.b + ")";
}
function Rand(min, max) {
  return Math.floor(min + Srand.random() * (max + 1 - min));
}
function Lerp(a, b, f) {
  return a + f * (b - a);
}
function Clamp(or, min, max) {
  if (or < min) or = min;
  if (or > max) or = max;
  return or;
}
