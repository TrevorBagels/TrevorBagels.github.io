function Initialize() {}

function OnKeyDown(kc) {
  if (kc == "KeyP") E.Camera.Zoom += 1;
  if (kc == "KeyI") UseOcclusionCulling = false;
}
//var t = new E.Obj(E.Camera.TargetPos);
//t.color = new rgb(255, 0, 0);
function OnDirectionDown(dir) {
  E.Camera.TargetPos = AddVectors(E.Camera.TargetPos, dir);
  //t.pos = AddVectors(E.Camera.TargetPos, [0, 1]);
  console.log(E.Camera.TargetPos);
}
for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 10; y++) {
    var h = Rand(1, 10) * 20;
    var o = new E.Obj([x, y], 0);
    o.color = new rgb(h, h, h);
  }
}
