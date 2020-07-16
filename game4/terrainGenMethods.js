var chunkSize = 100;
var chunkHeight = 100;
var intensity = 1;
var tiles = [];
var tiles2d = [];
var pNoiseData = [];
var thresh = 140;
var pNoiseSteepness = 5;

function Update() {}

function directionDown(x, y) {
  M.Camera.TargetPos[0] += x;
  M.Camera.TargetPos[1] += y;
}
function GetInp() {
  return document.getElementById("mainInput").value;
}
function Instruct(txt) {
  document.getElementById("mainInput").value = "";
  document.getElementById("Instructions").innerHTML = txt;
}
var step = 0;
function keyDown(kc) {
  console.log("press");
  if (kc == "Equal") M.Camera.zoom += 0.25;
  if (kc == "Minus") M.Camera.zoom -= 0.25;
  if (kc == "Enter") {
    console.log("enter");
    if (step == 1) {
      Srand.seed(GetInp());
      Instruct("Generation started");
      PNoise();
    }
    if (step == 0) {
      pNoiseSteepness = parseFloat(GetInp());
      Instruct("Please enter a seed value.");
    }
    step += 1;
  }
}

Instruct("Enter a steepness");
function PNoise() {
  for (var x = 0; x < chunkSize; x++) {
    pNoiseData.push([]);
    for (var y = 0; y < chunkHeight; y++) {
      var o = new M.Obj([x, y], 0);
      var h = 0;
      var increment = IN.rand(-pNoiseSteepness, pNoiseSteepness);
      if (x == 0 && y == 0) h = IN.rand(1, 255); //generates h (fisrt time gen)
      //similar to the height below it. get color below it and add a small value to it
      if (x == 0 && y !== 0) {
        h = pNoiseData[x][y - 1].he + increment;
      }
      if (x > 0) {
        if (y == 0) h = pNoiseData[x - 1][y].he + increment;
        if (y > 0)
          h =
            (pNoiseData[x - 1][y].he + pNoiseData[x][y - 1].he) / 2 + increment;
      }

      o.color = new rgb(h / 1.5, h / 1.5, h / 1.5).toStr();
      //thresh
      var tl = { he: h };
      pNoiseData[x].push(tl);
      //if (h < thresh) {
      //o.enabled = false;
      //console.log("thresh poof");
      //}
    }
  }
}
