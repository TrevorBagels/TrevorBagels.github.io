var gravity = 9.8;
var deltaTime = 1 / 1000;
var colliders = [];
function EdgeCollider(x, y, h, w) {
  colliders.push(this);
  this.x = x;
  this.y = y;
  this.x2 = x + h;
  this.y2 = y + w;
  this.vis = new E.Obj([x, y], 0, new rgb(0, 255, 0), true);
  this.vis.lineProperties.Pos1 = [this.x, this.y];
  this.vis.lineProperties.Pos2 = [this.x2, this.y2];
}
function SetRigidbody(objToSet) {
  objToSet.useCustomUpdate = true;
  objToSet.Physics = {};
  objToSet.Physics.velocity = [0, 0];
  objToSet.Physics.acceleration = 0;
  objToSet.Physics.mass = 1;
  objToSet.Physics.activeFriction = [1, 1];
  objToSet.Physics.accelerationH = 0;
  objToSet.CustomUpdate = function() {
    //force should be transfered from this object to the other upon collision. (if the object has no physics, transfer all velocity to it.)
    if (this.Physics.velocity[0] < 0)
      //x axis velocity
      this.Physics.accelerationH +=
        deltaTime * this.Physics.mass * this.Physics.activeFriction[0];
    if (this.Physics.velocity[0] > 0)
      this.Physics.accelerationH -=
        deltaTime * this.Physics.mass * this.Physics.activeFriction[0];
    this.Physics.accelerationH = Clamp(
      this.Physics.accelerationH * deltaTime,
      -1,
      1
    );
    //limit x velocity to -1 - 1
    this.Physics.velocity[0] = Clamp(
      this.Physics.velocity[0] + this.Physics.accelerationH * deltaTime
    );

    //vertical physics
    this.Physics.acceleration = Clamp(
      this.Physics.acceleration - deltaTime * gravity,
      -1,
      1
    );
    this.Physics.velocity[1] = Clamp(
      this.Physics.velocity[1] +
        gravity * this.Physics.acceleration * deltaTime,
      -1,
      1
    );
    if (
      PointIsCollision[this.pos[0] + this.pos[0] + this.Physics.velocity[0]]
    ) {
      var selfX = this.Physics.velocty[0];
      var otherX = -selfX;
      this.Physics.velocity[0] += otherX;
    }
    if (
      PointIsCollision([this.pos[0], this.pos[1] + this.Physics.velocity[1]])
    ) {
      console.log("hit");
      //calculate force transfered.
      var selfY = this.Physics.velocity[1];
      var otherY = -this.Physics.velocity[1];
      //currently doesn't work with two rigidbodies
      this.Physics.velocity[1] += otherY;
    }
    this.pos[1] += this.Physics.velocity[1];
    this.pos[0] += this.Physics.velocity[0];
  };
}
var ooo = new EdgeCollider(0, 5, 30, 0);
var oo2 = new EdgeCollider(20, 0, 0, 15);
var g = new E.Obj([10, 30], 0, new rgb(25, 0, 255));
SetRigidbody(g);

function PointIsCollision(pos) {
  //pos = [Math.floor(pos[0]), Math.floor(pos[1])];
  for (var i = 0; i < colliders.length; i++) {
    var c = colliders[i];
    //horizontal collision (hitting something from above)
    if (pos[0] < c.x2 && pos[0] + 1 > c.x && pos[1] < c.y2 && pos[1] + 1 > c.y)
      return true;
  }
  return false;
}
function OnDirectionDown(dir) {
  g.Physics.velocity = AddVectors([dir[0] / 100, 0], g.Physics.velocity);
  g.Physics.velocity[1] = dir[1] / 10;
}
