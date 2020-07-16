var cellCount = 100;
var initTemp = 2600; //in degrees F
var airTemp = 3300;
var maxHeight = 2000;
var inThermal = false;
var maxTempature = 5000;
var minTempature = -1000;
var avgTemp = 0;
var waterBits = [];
var cells = [];
var tempRes = 0.5; //resolution of tempature map
var tempatureColors = [];
var targetObj = new E.Obj(
  [E.Canvas.Self.width / E.GridSize / 2, E.Canvas.Self.width / E.GridSize / 2],
  1,
  new rgb(255, 0, 0)
);
//Note: cells is a 1D array, since 1d arrays have faster look up times than 2D arrays. to find a 2d index, use
//n = cells[x * cellCount + y]
Initialize();
function Initialize() {
  SetUpTempatures();
}
function Update() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].update();
  }
}
function SetUpTempatures() {
  //now select each pixel, and use them
  for (var i = 0; i < 500 * tempRes; i++) {
    var grd = E.ctx.createLinearGradient(0, 0, 500 * tempRes, 0);
    grd.addColorStop(0, "blue");
    grd.addColorStop(0.2, "green");
    grd.addColorStop(0.4, "yellow");
    grd.addColorStop(0.6, "orange");
    grd.addColorStop(0.8, "red");
    grd.addColorStop(1, "purple");
    // Fill with gradient
    E.ctx.fillStyle = grd;
    E.ctx.fillRect(10, 10, 500 * tempRes, 80);
    var p = E.ctx.getImageData(i + 10, 40, 1, 1).data;
    var color = new rgb(p[0], p[1], p[2]);
    tempatureColors.push(color);
  }
}
function OnKeyDown(kc) {
  if (kc == "KeyP") E.Camera.Zoom += 1;
  if (kc == "KeyI") UseOcclusionCulling = false;
}
function GetMatterInfo(m) {
  return (
    "Matter <br> State: " + m.state + "<br> Tempature: " + m.currentTempature
  );
}
function GetAllMaterInfo(mm) {
  var r = "";
  for (var i = 0; i < mm.length; i++) {
    r += GetMatterInfo(mm[i]) + "<br>";
  }
  return r;
}
//var t = new E.Obj(E.Camera.TargetPos);
//t.color = new rgb(255, 0, 0);
function OnDirectionDown(dir) {
  E.Camera.TargetPos = AddVectors(E.Camera.TargetPos, dir);
  targetObj.pos = AddVectors(targetObj.pos, dir);
  DisplayInformation();
  //t.pos = AddVectors(E.Camera.TargetPos, [0, 1]);
  //console.log(E.Camera.TargetPos);
}
function DisplayInformation() {
  var selectedCell = cells[targetObj.pos[0] * cellCount + targetObj.pos[1]];
  SetInfo(
    "Selected cell: " +
      selectedCell.x +
      ", " +
      selectedCell.y +
      "<br> Tempature: " +
      selectedCell.temp +
      "F" +
      "<br> Surface Temp: " +
      selectedCell.surfaceTemp +
      "<br> Temp Index = " +
      Math.round(((500 * tempRes) / maxTempature) * selectedCell.temp) +
      "<br> Height: " +
      selectedCell.height +
      " <br> Matter contained: <br> " +
      GetAllMaterInfo(selectedCell.additionalMatter)
  );
  document.getElementById("Info").innerHTML =
    "Average tempature: " + avgTemp + "F";
}
function HeatTransfer(heatA, heatB, timeMultiplier, densityA, densityB) {
  //convert to K
  var kA = heatA;
  var kB = heatB;
  //transfer heat
  //timeMultiplier /= (densityA + densityB) / 2;
  //reduce temp if air temp is colder
  if (airTemp + 15 < kA) kA -= timeMultiplier / 2;
  var diff = Math.abs(kA - kB);
  var diffM = 1;
  //change time multiplier - lower tempature = lower multiplier. This somewhat simulates kinetic energy/speed of particles based on their tempature.
  timeMultiplier = Clamp(
    (timeMultiplier * fToK(heatA) + 0.01) / 4000,
    0.05,
    500
  ); //this is screwing things up and making it to where hot is slow and cold is fast.
  //timeMultiplier = Clamp(
  // 4000 / (timeMultiplier * fToK(heatA) + 0.01),
  //  0.05,
  //  500
  //);
  if (kA > kB) {
    if (diff > 60) diffM = diff / 30;
    kB += timeMultiplier * diffM;
    kA -= timeMultiplier * diffM;
  }
  if (kB > kA) {
    if (diff > 60) diffM = diff / 30;
    kB -= timeMultiplier * diffM;
    kA += timeMultiplier * diffM;
  }
  return [kA, kB];
  /*
  // console.log(kA);
  //transfer heat between eachother. Both tempatures should add to the same temp, but they will someone balance eachother
  var lower = kA;
  var higher = kB;
  //sort them
  if (kB < kA) {
    lower = kB;
    higher = kA;
  }
  if (lower == kB) {
    kB += Clamp(timeMultiplier, 0, Math.abs(lower - higher));
    kA -= Clamp(timeMultiplier, 0, Math.abs(higher - lower));
  } else {
    kA -= Clamp(timeMultiplier, 0, Math.abs(lower - higher));
    kB += Clamp(timeMultiplier, 0, Math.abs(higher - lower));
  }*/
  return [kA, kB];
}
function kToF(t) {
  return ((t - 273.15) * 9) / 5 + 32;
}
function fToK(t) {
  return ((t - 32) * 5) / 9 + 273.15;
}
//gets index of thermal color value
function toThermal(thermalValue) {
  //convert F to K
  //var K = ((thermalValue - 32) * 5) / 9 + 273.15;
  //in kelvin
  var K = thermalValue;
  K = Clamp(K, minTempature, maxTempature);
  //set minTemp to 0 by adding minTemp to K.
  //ie: if K = 500, min = -100, max = 600, convert k by adding abs(-100) to it (gets )
  //K += -minTempature;
  //get index of tempature color
  //500/maxTempature = a threshhold kind of thing between 0 and 1.
  var index = Math.round(((500 * tempRes) / maxTempature) * K);
  var t = tempatureColors[Clamp(index, 0, 500 * tempRes - 1)];
  return t;
}
function Log(txt) {
  document.getElementById("Notif").innerHTML += "<br>" + txt;
}
function SetInfo(txt) {
  document.getElementById("cellInfo").innerHTML = txt;
}

var timesSpread = 0;
function SpreadTemp() {
  DisplayInformation();
  if (tempscale == 3) {
    minTempature = avgTemp - 100;
    maxTempature = avgTemp + 50;
  }
  timesSpread += 1;
  if (timesSpread >= 900) {
    Log("Complete");
    //clearInterval(step2interval);
    timesSpread = -100000;
  }
  airTemp -= 25;
  airTemp = Clamp(airTemp, 90, 6000);
  for (var i = 0; i < 10; i++) {
    var o = 0;
    for (var ii = 0; ii < cellCount * cellCount; ii++) {
      o += cells[ii].temp;
      var a = AdjacentCells(cells[ii].x, cells[ii].y);
      var timeM = 0.25;
      for (var iii = 0; iii < a.length; iii++) {
        var newTemps = HeatTransfer(
          cells[ii].temp,
          cells[a[iii]].temp,
          timeM,
          cells[ii].density,
          cells[a[iii]].density
        );
        cells[ii].temp = newTemps[0];
        cells[a[iii]].temp = newTemps[1];
      }
      if (inThermal) cells[ii].updateColor(toThermal(cells[ii].temp));
    }
    avgTemp = o / (cellCount * cellCount);
  }
}

function Water(x, y, state) {
  waterBits.push(this);
  this.x = x;
  this.y = y;
  this.density = 0.5;
  this.partialCoords = [x, y]; //when moving with velocity
  this.velocity = [0.02, -0.01];
  this.currentTempature = Rand(40, 53);
  console.log("NEW WATER " + this.x + ", " + this.y);
  cells[CINDX(x, y)].additionalMatter.push(this);
  this.particles = [];
  this.freezing = 32;
  this.boiling = 212;
  this.colors = [
    new rgb(64, 134, 247),
    new rgb(0, 246, 255),
    new rgb(130, 211, 255)
  ];
  //0 = solid, 1 = liquid, 2 = gas
  this.state = 1;
  if (state != undefined) this.state = state;
  this.update = function() {
    //heat transfer
    if (this.state == 1 || this.state == 0) {
      var cellHeat = cells[CINDX(this.x, this.y)].surfaceTemp;
      var nh = HeatTransfer(
        this.currentTempature,
        cellHeat,
        2.25,
        this.density,
        cells[CINDX(this.x, this.y)].density
      );
      cells[CINDX(this.x, this.y)].surfaceTemp = nh[1];
      this.currentTempature = nh[0];
      var nh2 = HeatTransfer(
        cells[CINDX(this.x, this.y)].surfaceTemp,
        cells[CINDX(this.x, this.y)].temp,
        2.25,
        this.density,
        cells[CINDX(this.x, this.y)].density
      );
      cells[CINDX(this.x, this.y)].temp = nh2[1];
    }
    if (this.state == 2) {
      this.partialCoords[0] +=
        this.velocity[0] + Rand(-this.velocity[0] / 10, this.velocity[0] / 10);
      this.partialCoords[1] +=
        this.velocity[1] + Rand(-this.velocity[1] / 10, this.velocity[1] / 10);
      if (
        Math.floor(this.partialCoords[0]) != this.x ||
        Math.floor(this.partialCoords[1]) != this.y
      ) {
        this.x = Math.floor(this.partialCoords[0]);
        this.y = Math.floor(this.partialCoords[1]);
        if (cells[CINDX(this.x, this.y)].additionalMatter.length > 1) {
          var c = GetCellWithLeastStuff(this.x, this.y);
          this.x = c.x;
          this.y = c.y;
        }
        cells[CINDX(this.x, this.y)].additionalMatter.push(this);
      }
    }
    if (this.state == 1 && this.currentTempature >= this.boiling) {
      this.state = 2;
      //evaporated
      console.log("Evaporate water");
    }
  };
}

function ViewThermal() {
  inThermal = !inThermal;
  if (inThermal)
    for (var i = 0; i < cells.length; i++) {
      cells[i].updateColor(toThermal(cells[i].temp));
    }
  if (!inThermal)
    for (var i = 0; i < cells.length; i++) {
      var h = cells[i].height * (255 / maxHeight);
      cells[i].updateColor(new rgb(h, h, h));
    }
}

function Cell(x, y, temp) {
  cells.push(this);
  this.height = Rand(300, 500) + 800;
  this.heightTo255 = (255 / maxHeight) * this.height;
  this.mass = 15;
  this.density = 1;
  this.obj = new E.Obj([x, y], 0);
  this.obj.color = new rgb(
    this.heightTo255,
    this.heightTo255,
    this.heightTo255
  );
  this.pos = [x, y];
  this.x = x;
  this.y = y;
  this.temp = temp;
  this.surfaceTemp = temp;
  this.additionalMatter = [];
  this.updateColor = function(newC) {
    this.obj.color = newC;
  };
  this.update = function() {
    this.surfaceTemp = HeatTransfer(
      this.temp + 90,
      this.surfaceTemp,
      1,
      this.density,
      0.15
    )[1];
    var newMatter = [];
    //remove null matter and update it
    for (var i = 0; i < this.additionalMatter.length; i++) {
      var m = this.additionalMatter[i];
      if (m !== undefined) {
        m.update();
        if (Math.floor(m.x) === this.x && Math.floor(m.y) === this.y)
          newMatter.push(m);
      }
    }
    this.additionalMatter = newMatter;
    if (!inThermal) {
      //show things like height and color and stuff.
      if (this.additionalMatter.length != 0) {
        this.obj.color = this.additionalMatter[0].colors[
          this.additionalMatter[0].state
        ];
      } else {
        var h = (255 / maxHeight) * this.height;
        this.obj.color = new rgb(h, h, h);
      }
    }
  };
}
