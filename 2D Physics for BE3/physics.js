var solids = [];
var liquids = [];
var solids2D = [];
var cells2D = [];
var worldSize = 100;
var physicsChange = true;
for (var i = 0; i < worldSize * worldSize; i++) {
  solids2D.push(null);
  cells2D.push(null);
}
function WINDX(x, y) {
  return x * worldSize + y;
}
var gravity = [0, -9.8];
var maxVel = 1;
var P = {
  SetAsSolid: function(objToSet) {
    objToSet.Physics = true;
    objToSet.isSolid = true;
    objToSet.updatePhysics = function() {};
    solids.push(objToSet);
    solids2D[WINDX(objToSet.pos[0], objToSet.pos[1])] = objToSet;
  },
  SetAsLiquid: function(objToSet) {
    objToSet.Physics = true;
    objToSet.isLiquid = true;
    objToSet.isSettled = false;
    objToSet.vel = [0, 0];
    objToSet.floatPos = objToSet.pos;
    objToSet.updatePhysics = function() {
      if (this.isSettled && !physicsChange) return;
      //update velocity (using gravity)
      //physicsChange = true;
      this.vel[0] +=
        (((1 / 2) * gravity[0]) / 100) * Math.abs(((1 / 2) * gravity[0]) / 100);
      this.vel[1] +=
        (((1 / 2) * gravity[1]) / 100) * Math.abs(((1 / 2) * gravity[1]) / 100);
      this.vel[1] = Clamp(this.vel[1], -maxVel, maxVel);
      this.vel[0] = Clamp(this.vel[0], -maxVel, maxVel);
      var prevF = this.floatPos;
      this.floatPos[0] += this.vel[0];
      this.floatPos[1] += this.vel[1];
      //check to see if the current position collides with anything
      if (WillCollide(this.floatPos)) {
        this.isSettled = true;
        physicsChange = false;
        this.floatPos = [Math.round(prevF[0]), Math.round(prevF[1])];
        this.vel = [0, 0];
        console.log("Collide");
      }
      this.targetPos[0] = this.floatPos[0];
      this.targetPos[1] = this.floatPos[1];
    };
    liquids.push(objToSet);
  }
};
function WillCollide(pos) {
  var x = Math.round(pos[0]);
  var y = Math.round(pos[1]);
  if (solids2D[WINDX(x, y)] != null) return true;
  return false;
}
function PointsCollide(p1, p2) {
  if (
    Math.floor(p1[0]) == Math.floor(p2[0]) &&
    Math.floor(p1[1]) == Math.floor(p2[1])
  )
    return true;
  return false;
}
function ObjsCollide(obj1, obj2) {
  if (obj1 == obj2) return false;
  if (
    (obj1.isSolid != undefined && obj1.isSolid == true) ||
    (obj2.isSolid != undefined && obj2.isSolid == true)
  ) {
    if (
      Math.floor(obj1.pos[0]) == Math.floor(obj2.pos[0]) &&
      Math.floor(obj1.pos[1]) == Math.floor(obj2.pos[1])
    ) {
      return true;
    }
  }
  return false;
}
setInterval(PhysicsUpdate, 10);
function PhysicsUpdate() {
  for (var i = 0; i < solids.length; i++) {
    solids[i].updatePhysics();
  }
  for (var i = 0; i < liquids.length; i++) {
    liquids[i].updatePhysics();
  }
}
