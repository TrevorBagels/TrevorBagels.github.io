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
function keyDown(kc) {
  if (kc == "Equal") M.GridSize += 0.25;
  if (kc == "Minus") M.GridSize -= 0.25;
}
