var tempCtrlData = "	";
var currentControlSet = 0;
//0 = none, 1 = temp, 2 = cell
function TempCTRL() {
  if (currentControlSet == 1) {
    currentControlSet = 0;
    document.getElementById("tempCTRL").style.visibility = "hidden";
    document.getElementById("tempCTRL_B").style.backgroundColor = "gray";
    return;
  }
  currentControlSet = 1;
  document.getElementById("tempCTRL").style.visibility = "visible";
  document.getElementById("tempCTRL_B").style.backgroundColor = "lightblue";
}
function DisableCTRLS() {
  document.getElementById("tempCTRL").style.visibility = "hidden";
  document.getElementById("tempCTRL_B").style.backgroundColor = "gray";
  document.getElementById("cellCTRL").style.visibility = "hidden";
  document.getElementById("cellCTRL_B").style.backgroundColor = "gray";
}
function CellCTRL() {
  if (currentControlSet == 2) {
    currentControlSet = 0;
    document.getElementById("cellCTRL").style.visibility = "hidden";
    document.getElementById("cellCTRL_B").style.backgroundColor = "gray";
    return;
  }
  currentControlSet = 2;
  document.getElementById("cellCTRL").style.visibility = "visible";
  document.getElementById("cellCTRL_B").style.backgroundColor = "lightblue";
}
var celltemp = false;
function cellTemp() {
  document.getElementById("cellTempCTRL").style.visibility = "hidden";
  celltemp = !celltemp;
  if (celltemp)
    document.getElementById("cellTempCTRL").style.visibility = "visible";
}
function ModifyTemp(method) {
  var amt = parseFloat(document.getElementById("cellTempModify").value);
  console.log(amt);
  var selectedCell = cells[targetObj.pos[0] * cellCount + targetObj.pos[1]];
  if (method == "set") selectedCell.temp = amt;
  if (method == "-") selectedCell.temp -= amt;
  if (method == "+") selectedCell += amt;
}

var Step = 0;
function Continue() {
  Step += 1;
  if (Step == 1) Step1();
  if (Step == 2) Step2();
  if (Step == 3) Step3();
}
function Step1() {
  Log("Generating cells");
  for (var x = 0; x < cellCount; x++) {
    for (var y = 0; y < cellCount; y++) {
      new Cell(x, y, initTemp + Rand(-50, 50));
    }
  }
  Log("Cell generation complete. Total of " + cells.length + " cells.");
  setInterval(Update, 30);
}
var step2interval = null;
function Step2() {
  Log("Spreading out tempatures");
  //go through every cell, select adjacent cells and combine their average tempatures
  step2interval = setInterval(SpreadTemp, 10);
}
function Step3() {
  Log("Creating water");
  for (var i = 0; i < 30; i++) {
    var coords = [Rand(1, cellCount - 1), Rand(1, cellCount - 1)];
    for (var ii = 0; ii < 10; ii++) new Water(coords[0], coords[1]);
  }
}

var tempscale = 0;

function ChangeTempScale() {
  tempscale += 1;
  SpreadTemp();
  if (tempscale >= 4) tempscale = 0;
  if (tempscale == 0) {
    minTempature = 1000;
    maxTempature = 6000;
  }
  if (tempscale == 1) {
    minTempature = -500;
    maxTempature = 3000;
  }
  if (tempscale == 2) {
    minTempature = 20;
    maxTempature = 250;
  }
  if (tempscale == 3) {
    minTempature = avgTemp - 70;
    maxTempature = avgTemp + 90;
  }
  ViewThermal();
  ViewThermal();
  var d = document.getElementById("tempScale");
  d.innerHTML =
    "Low (" + minTempature + ") - - - - - - - - - High (" + maxTempature + ")";
}
