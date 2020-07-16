var cnvs = document.getElementById("Canvas");
var objs = [];
var objsLines = [];
var UseOcclusionCulling = true;
//create layers
var MaxLayers = 5;
for (var i = 0; i < MaxLayers; i++) {
  objs.push([]);
}
var E = {
  ClearScreen: true,
  UseTrueKeyCodes: false,
  GridSize: 10,
  Canvas: {
    Self: document.getElementById("Canvas"),
    Height: cnvs.height,
    Width: cnvs.width
  },
  Camera: { Position: [0, 0], Zoom: 1, TargetPos: [0, 0] },
  ctx: document.getElementById("Canvas").getContext("2d"),
  Obj: function(pos, layer, color, isLine) {
    this.pos = pos;
    this.useCustomShapes = false;
    this.useCustomUpdate = false;
    this.targetPos = pos;
    this.moving = false;
    this.layer = 0;
    this.isLine = false;
    if (isLine === true) this.isLine = true;
    this.lineProperties = { Pos1: [0, 0], Pos2: [0, 0] };
    if (this.isLine) objsLines.push(this);
    this.speed = 0.25;
    if (layer !== undefined) this.layer = layer;
    this.layer = Clamp(this.layer, 0, MaxLayers);
    objs[this.layer].push(this);
    this.color = new rgb(0, 0, 0);
    if (color !== undefined) this.color = color;
    this.enabled = true;
    this.visPos = this.pos;
    this.a = 1;
    this.moveTo = function(position) {
      this.moving = true;
      this.targetPos = position;
    };
    this.CustomUpdate = function() {
      console.log("Test");
    };
    this.CustomShape = function() {};
    this.update = function() {
      if (this.useCustomUpdate) {
        this.CustomUpdate();
      }
      if (this.isLine) {
        if (
          !InView(this.lineProperties.Pos1) &&
          !InView(this.lineProperties.Pos2)
        )
          return;
        var p1 = FakeToRealCoords(this.lineProperties.Pos1);
        var p2 = FakeToRealCoords(this.lineProperties.Pos2);
        var offset = (E.GridSize * E.Camera.Zoom) / 2;
        E.ctx.globalAlpha = this.a;
        E.ctx.strokeStyle = this.color.color;
        E.ctx.beginPath();
        E.ctx.moveTo(p1[0] + offset, p1[1] + offset);
        E.ctx.lineTo(p2[0] + offset, p2[1] + offset);
        E.ctx.stroke();
        E.ctx.closePath();
        return;
      }
      if (!InView(this.pos)) return;
      if (!this.moving) this.targetPos = this.pos;
      if (this.enabled) {
        var didDraw = Draw(this.pos, this.color.color, this.a);
        if (this.moving) {
          if (Distance(this.pos, this.targetPos) < 0.025) {
            this.moving = false;
            this.pos = this.targetPos;
          }
          if (this.moving)
            this.pos = LerpVectors(this.pos, this.targetPos, this.speed);
        }
        if (didDraw !== false && this.useCustomShapes) this.CustomShape();
      }
    };
  }
};

document.onload = function() {
  if (typeof Initialize != undefined) eval("Initialize();");
};
function CustomText(pos, pixOffsets, txt, c, a, size) {
  if (!InView(pos)) return;
  E.ctx.globalAlpha = a;
  E.ctx.fillStyle = c.color;
  var realX =
    (pos[0] + pixOffsets[0]) * E.GridSize - E.Camera.Position[0] * E.GridSize;
  var realY = FakeToRealY(
    (pos[1] + pixOffsets[1]) * E.GridSize - E.Camera.Position[1] * E.GridSize
  );
  E.ctx.font = size * 12 + "px Arial";
  E.ctx.fillText(txt, realX * E.Camera.Zoom, realY * E.Camera.Zoom);
}

function DrawCustom(pos, pixOffsets, l, w, c, a) {
  if (!InView(pos)) return;
  E.ctx.globalAlpha = a;
  E.ctx.fillStyle = c.color;
  var realX =
    (pos[0] + pixOffsets[0]) * E.GridSize - E.Camera.Position[0] * E.GridSize;
  var realY = FakeToRealY(
    (pos[1] + pixOffsets[1]) * E.GridSize - E.Camera.Position[1] * E.GridSize
  );
  E.ctx.fillRect(
    realX * E.Camera.Zoom,
    realY * E.Camera.Zoom,
    E.GridSize * E.Camera.Zoom * l,
    E.GridSize * E.Camera.Zoom * w
  );
}

function Draw(pos, c, a) {
  if (!InView(pos)) return false;
  E.ctx.globalAlpha = a;
  E.ctx.fillStyle = c;
  var realX = pos[0] * E.GridSize - E.Camera.Position[0] * E.GridSize;
  var realY = FakeToRealY(
    pos[1] * E.GridSize - E.Camera.Position[1] * E.GridSize
  );
  E.ctx.fillRect(
    realX * E.Camera.Zoom,
    realY * E.Camera.Zoom,
    E.GridSize * E.Camera.Zoom,
    E.GridSize * E.Camera.Zoom
  );
  return true;
}
function FakeToRealCoords(pos) {
  var realX = pos[0] * E.GridSize - E.Camera.Position[0] * E.GridSize;
  var realY = FakeToRealY(
    pos[1] * E.GridSize - E.Camera.Position[1] * E.GridSize
  );
  return [realX * E.Camera.Zoom, realY * E.Camera.Zoom];
}
setInterval(MainUpdate, 10);
function MainUpdate() {
  //E.Camera.Zoom += 0.01;
  E.Camera.Position = LerpVectors(E.Camera.Position, E.Camera.TargetPos, 0.25);
  Clear();
  for (var l = 0; l < objs.length; l++)
    for (var i = 0; i < objs[l].length; i++)
      if (objs[l][i].isLine == false) objs[l][i].update();
  for (var i = 0; i < objsLines.length; i++) objsLines[i].update();

  E.ctx.closePath();
}

document.addEventListener("keydown", function(event) {
  //console.log(event.code);
  var kC = "none";
  if (event.keyCode == 87 || event.keyCode == 38) kC = "up";
  if (event.keyCode == 83 || event.keyCode == 40) kC = "down";
  if (event.keyCode == 68 || event.keyCode == 39) kC = "right";
  if (event.keyCode == 65 || event.keyCode == 37) kC = "left";
  if (kC === "none" || E.UseTrueKeyCodes) {
    kC = event.code;
    if (typeof OnKeyDown != undefined) eval("OnKeyDown(kC)");
  }
  var x = 0;
  var y = 0;
  if (kC === "up") y = 1;
  if (kC === "down") y = -1;
  if (kC === "left") x = -1;
  if (kC === "right") x = 1;
  if (typeof OnDirectionDown != undefined) eval("OnDirectionDown([x, y])");
});
//used to figure out if we need to draw anything or not. It's basically occlusion culling
function InView(pos) {
  if (!UseOcclusionCulling) return true;
  var x =
    (pos[0] * E.GridSize - E.Camera.Position[0] * E.GridSize) * E.Camera.Zoom; //actual on screen position
  var y =
    FakeToRealY(pos[1] * E.GridSize - E.Camera.Position[1] * E.GridSize) *
    E.Camera.Zoom;
  var cx = E.Camera.TargetPos[0];
  var cy = E.Camera.TargetPos[1];
  if (
    x >= 0 - E.GridSize &&
    x <= E.Canvas.Self.width &&
    y >= 0 - E.GridSize &&
    y <= E.Canvas.Self.height
  )
    return true;
  return false;
}
function TestThing(pos) {
  var x =
    (pos[0] * E.GridSize - E.Camera.Position[0] * E.GridSize) * E.Camera.Zoom; //actual on screen position
  return x;
}
/*
function InView(pos) {
  if (!UseOcclusionCulling) return true;
  var x = 1 + pos[0] * E.Camera.Zoom;
  var y = 1 + pos[1] * E.Camera.Zoom;
  var cx = E.Camera.Position[0];
  var cy = E.Camera.Position[1];
  if (x < cx + E.Canvas.Self.width / E.GridSize / E.Camera.Zoom && x >= cx - 1)
    if (
      y - 1 <= cy + E.Canvas.Self.width / E.GridSize / E.Camera.Zoom &&
      y >= cy - 1
    )
      return true;
  testBool = true;
  return false;
}*/
function Clear() {
  if (E.ClearScreen)
    E.ctx.clearRect(0, 0, E.Canvas.Self.width, E.Canvas.Self.height);
}
//use a real position and get it's converted position
function RealToFakeY(yValue) {
  return -(yValue - E.Canvas.Self.height);
}
//get a converted position and get it's on screen position
function FakeToRealY(yValue) {
  return -yValue + E.Canvas.Self.height;
}
