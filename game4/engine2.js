var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var gridSize = 3;
var canvasDim = [
  Math.round(canvas.width / gridSize),
  Math.round(canvas.height / gridSize)
];

var M = {
  World: { Size: [500, 500], Depth: 10 },
  GridSize: gridSize,
  Camera: {
    pos: [0, 0],
    zoom: 1,
    TargetPos: [canvasDim[0] / 2, canvasDim[0] / 2],
    CanMove: true
  },
  Mouse: {
    PosAbs: [0, 0],
    Pos: [0, 0],
    down: false,
    ScreenPos: [0, 0]
  },
  Objs: [],
  CollisionObjs: [],
  CollisionObjs2D: [],
  CollisionUpdatePending: false,
  Layers: 3,
  RealToFakeY: function(yValue) {
    return -(yValue - 300);
  },
  FakeToRealY: function(yValue) {
    return -yValue + 300;
  },
  FakeToRealPosition: function(x, y) {
    return [x - M.Camera.pos[0], y - M.Camera.pos[1]];
  },
  RealToFakePosition: function(x, y) {
    return [x + M.Camera.pos[0], y + M.Camera.pos[0]];
  },
  ScreenToWorldPosition: function(x, y) {
    return [
      Math.round(x / M.GridSize) + (M.Camera.pos[0] - canvasDim[0] / 2),
      Math.round(y / M.GridSize) + (M.Camera.pos[0] - canvasDim[0] / 2)
    ];
  },
  UpdateInfo: function(txt) {
    document.getElementById("Info").innerHTML = txt;
  },
  Notify: function(txt) {
    NotifyThing(txt);
  },
  Obj: function(pos, layer) {
    this.static = true;
    this.velocity = [0, 0];
    this.velocityStep = [0, 0];
    this.pos = [0, 0];
    this.layer = 0;
    if (layer !== undefined) this.layer = layer;
    M.Objs[this.layer].push(this);
    this.enabled = true;
    this.size = 1;
    this.collide = false;
    this.smoothPosition = true;
    this.a = 1;
    this.weight = 1; //movement reducer
    this.color = "black";
    if (pos !== undefined) this.pos = pos;
    this.visiblePosition = this.pos;
    this.lastPos = this.pos; //used to determine whether or not a collision update is needed.
    this.enableCollide = function() {
      M.CollisionObjs.push(this);
      this.collide = true;
      M.CollisionUpdatePending = true;
    };
    if (this.collide) this.enableCollide();
    this.edgesCollide = function(posToCheck) {
      UpdateAllCollisionIndexes();
      var collidingObject = M.CollisionObjs2D[posToCheck[0]][posToCheck[1]];
      if (collidingObject === undefined) return false;
      if (collidingObject === null) return false;
      if (!collidingObject.collide) return false;
      if (collidingObject.enabled == false) return false;

      if (
        Math.abs(this.pos[0] - posToCheck[1]) == 1 ||
        Math.abs(this.pos[1] - posToCheck[1]) == 1
      )
        return true;
      return false;
    };
    this.move = function(newP) {
      var x = newP[0];
      var y = newP[1];
      var newPos = [this.pos[0] + x, this.pos[1] + y];
      if (!this.edgesCollide(newPos)) {
        console.log("moved");
        this.pos = newPos;
      }

      //check to see if object can move to designated position
    };
    this.update = function() {
      if (this.smoothPosition) {
        var smoothing = 0.05;
        this.visiblePosition = [
          IN.lerp(this.visiblePosition[0], this.pos[0], smoothing),
          IN.lerp(this.visiblePosition[1], this.pos[1], smoothing)
        ];
      } else {
        this.visiblePosition = this.pos;
      }
      this.lastPos = this.pos;
      if (this.enabled) {
        //use velocity to determine whether or not the object is going to move
        if (!this.static) {
          this.velocityStep[0] += this.velocity[0];
          this.velocityStep[1] += this.velocity[1];
          //up
          if (this.velocityStep[1] >= 1 * this.weight) {
            this.velocityStep[1] = 0;
            this.pos[1] += 1;
          }
          //down
          if (this.velocityStep[1] <= -1 * this.weight) {
            this.velocityStep[1] = 0;
            this.pos[1] -= 1;
          }
          //left
          if (this.velocityStep[0] <= -1 * this.weight) {
            this.velocityStep[0] = 0;
            this.pos[0] -= 1;
          }
          //right
          if (this.velocityStep[0] >= 1 * this.weight) {
            this.velocityStep[0] = 0;
            this.pos[0] += 1;
          }
        }
        if (this.lastPos[0] != this.pos[0] || this.lastPos[1] != this.pos[1]) {
          //changed position
          if (this.collide) M.CollisionUpdatePending = true;
        }
        //check for shadow source

        Draw(
          this.visiblePosition[0] + this.velocityStep[0],
          this.visiblePosition[1] + this.velocityStep[1],
          this.size,
          this.size,
          this.color,
          this.alpha
        );
      }
    };
  }
};
Initialize();
function Initialize() {
  for (var la = 0; la < M.Layers; la++) {
    M.Objs.push([]);
  }
  canvas.setAttribute("onmousemove", "getMousePos(event)");
  setInterval(EngineUpdate, 10);
}

function EngineUpdate() {
  //update
  Update();
  //move camera
  var camSpeed = 0.9;
  M.Camera.pos[0] = IN.lerp(M.Camera.pos[0], M.Camera.TargetPos[0], camSpeed);
  M.Camera.pos[1] = IN.lerp(M.Camera.pos[1], M.Camera.TargetPos[1], camSpeed);
  Clear();
  for (var l = 0; l < M.Layers; l += 1) {
    for (var i = 0; i < M.Objs[l].length; i++) {
      M.Objs[l][i].update();
    }
  }
}
function UpdateAllCollisionIndexes() {
  if (M.CollisionUpdatePending)
    for (var i = 0; i < M.CollisionObjs.length; i++) {
      M.CollisionObjs2D[M.CollisionObjs[i].x][M.CollisionObjs[i].y] =
        M.CollisionObjs[i];
    }
  M.CollisionUpdatePending = false;
}
function ScreenDim() {
  //screen in tiles
  return [canvas.width / M.GridSize, canvas.height / M.GridSize];
}
//used for performance purposes
function inView(x, y) {
  var cx = M.Camera.pos[0] - ScreenDim()[0] / 2;
  var cy = M.Camera.pos[1] - ScreenDim()[1] / 2;
  if (
    x > cx - 1 &&
    x < cx + ScreenDim()[0] &&
    y > cy &&
    y - 1 < cy + ScreenDim()[1]
  )
    return true;

  return false;
}
function Draw(x, y, l, w, color, alpha) {
  if (!inView(x, y)) return;
  //console.log("Draw");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  //offsets
  var offsetX = (x - (M.Camera.pos[0] - canvasDim[0] / 2)) * M.GridSize;
  var offsetY = M.FakeToRealY(
    (y - (M.Camera.pos[1] - canvasDim[0] / 2)) * M.GridSize
  );
  offsetX -= ctx.fillRect(
    offsetX * M.Camera.zoom,
    offsetY * M.Camera.zoom,
    M.GridSize * M.Camera.zoom * l,
    M.GridSize * M.Camera.zoom * w
  );
}
console.log(canvasDim);
function Clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  //mouse Abs is the absolute position of the mouse
  M.Mouse.PosAbs = [
    evt.clientX - rect.left,
    M.RealToFakeY(evt.clientY - rect.top)
  ];
  M.Mouse.ScreenPos = M.RealToFakePosition(
    M.Mouse.PosAbs[0],
    M.Mouse.PosAbs[1]
  );
  var w = M.ScreenToWorldPosition(M.Mouse.ScreenPos[0], M.Mouse.ScreenPos[1]);
  M.Mouse.Pos = w;
}
var notificationAmt = 0;
var notifications = [];
function NotifyThing(notification) {
  notificationAmt += 1;
  var n = document.getElementById("Notif");
  n.innerHTML +=
    "<a id='notification" + notificationAmt + "'><br>" + notification + "</a>";
  notifications.push(notificationAmt);
  setTimeout(function() {
    document.getElementById("notification" + notifications[0]).innerHTML = "";
    notifications.shift();
  }, 1050);
}
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
function OnKeyDown(keyCode) {
  eval("keyDown(keyCode);");
}
function OnDirectionDown(x, y) {
  eval("directionDown(x, y);");
}

document.addEventListener("keydown", function(event) {
  console.log(event.code);
  var kC = "none";
  if (event.keyCode == 87 || event.keyCode == 38) kC = "up";
  if (event.keyCode == 83 || event.keyCode == 40) kC = "down";
  if (event.keyCode == 68 || event.keyCode == 39) kC = "right";
  if (event.keyCode == 65 || event.keyCode == 37) kC = "left";
  if (kC === "none") {
    kC = event.code;
    OnKeyDown(kC);
  }
  var x = 0;
  var y = 0;
  if (kC === "up") y = 1;
  if (kC === "down") y = -1;
  if (kC === "left") x = -1;
  if (kC === "right") x = 1;
  OnDirectionDown(x, y);
});

function TestingCameraOffset() {
  var target = new M.Obj(9, 9, 2);
  target.color = "red";
  M.Camera.TargetX = 8;
  M.Camera.TargetY = 8;
}
function Distance(p1, p2) {
  var a = p1[0] - p2[0];
  var b = p1[1] - p2[1];
  return Math.sqrt(a * a + b * b);
}
