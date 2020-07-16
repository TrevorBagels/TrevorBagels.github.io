var Cells = [];
var WorldSize = 95;
E.Camera.Zoom = 0.4;
E.Camera.TargetPos = [15, 25];
var gasses = [];
var valveOpenings = [[42, 31], [42, 32], [42, 33]];
GenerateCells();
function GenerateCells() {
  for (var i = 0; i < WorldSize * WorldSize; i++) {
    Cells.push(new Cell(i));
  }
  console.log("test");
  Plate([25, 25], [40, 25]);
  Plate([25, 40], [40, 40]);
  Plate([25, 25], [25, 40]);
  //opening
  Plate([40, 25], [40, 30]);
  Plate([40, 34], [40, 41]);
  //valve tunnel (top and bottom)
  Plate([40, 34], [44, 34]);
  Plate([40, 30], [44, 30]);
  for (var i = 0; i < valveOpenings.length; i++) {
    Cells[CINDX(valveOpenings[i])].setSolid();
  }
  Plate([43, 35], [60, 35]);
  Plate([43, 29], [60, 29]);
}
var valveOpen = false;
function OpenValve() {
  valveOpen = !valveOpen;
  if (valveOpen) {
    for (var i = 0; i < valveOpenings.length; i++) {
      Cells[CINDX(valveOpenings[i])].solid = false;
    }
  } else {
    for (var i = 0; i < valveOpenings.length; i++) {
      Cells[CINDX(valveOpenings[i])].setSolid();
    }
  }
}
function Plate(pos, pos2) {
  var xAmt = Math.abs(pos[0] - pos2[0]);
  var yAmt = Math.abs(pos[1] - pos2[1]);
  for (var x = 0; x < xAmt; x++) {
    Cells[CINDX([pos[0] + x, pos[1]])].setSolid();
  }
  for (var y = 0; y < yAmt; y++) {
    Cells[CINDX([pos[0], pos[1] + y])].setSolid();
  }
}

setInterval(CellsUpdate, 10);
function CellsUpdate() {
  for (var i = 0; i < WorldSize * WorldSize; i++) {
    Cells[i].update();
  }
  for (var i = 0; i < gasses.length; i++) {
    gasses[i].update();
  }
  for (var i = 0; i < 100; i++)
    if (gasses.length < 4900) {
      new Gas([27, 28]);
    }
}
function Cell(index) {
  this.index = index;
  this.x = Math.floor(index / WorldSize);
  this.y = index - this.x * WorldSize;
  this.pos = [this.x, this.y];
  this.vis = new E.Obj(this.pos, 0, new rgb(100, 100, 100));
  this.solid = false;
  this.gasses = 0;
  this.setSolid = function() {
    this.solid = true;
  };
  this.update = function() {
    var color = new rgb(175, 175, 175 * Math.sqrt(this.x / 8));
    if (this.solid) color = new rgb(0, 0, 0);
    if (this.gasses > 0)
      color = new rgb(30 * this.gasses, 30, 30 * this.gasses);
    this.vis.color = color;
  };
}
function Gas(pos) {
  this.pos = pos;
  this.velocity = 10;
  this.movementStep = 200;
  gasses.push(this);
  this.move = function(newPos) {
    if (this.pos === newPos) return;
    Cells[CINDX(this.pos)].gasses -= 1;
    this.pos = [Math.floor(newPos[0]), Math.floor(newPos[1])];
    Cells[CINDX(this.pos)].gasses += 1;
  };
  Cells[CINDX(this.pos)].gasses += 1;
  this.update = function() {
    //this.move(this.pos);
    var cell = Cells[CINDX(this.pos)];
    if (cell.gasses >= 1) {
      var f = new Filter("gasses", 0);
      f.CheckFilter = function(c) {
        //var tf = [true, false, true, false];
        //return tf[Rand(0, 4)];
        if (!c.solid) return true;
        return false;
      };

      var newCell = AdjCells(cell.index, f);
      var greatestCell = 0;
      if (newCell.length > 1)
        for (var i = 0; i < newCell.length; i++) {
          if (
            newCell[i].gasses < newCell[greatestCell].gasses ||
            (newCell[i].gasses == newCell[greatestCell].gasses &&
              Rand(0, 15) == 3)
          )
            greatestCell = i;
          //try setting newCell[greatestCell].gasses to just newCell[greatestCell] for an interesting effect.
        }
      if (
        newCell != null &&
        newCell[greatestCell] !== undefined &&
        this.movementStep >= 125
      ) {
        this.move(newCell[greatestCell].pos);
        this.movementStep = 0 + this.velocity;
      }
    }
    this.velocity *= 0.975;
    this.velocity = Clamp(
      this.velocity,
      Cells[CINDX(this.pos)].gasses * 4,
      this.velocity * 8
    );
    this.movementStep += this.velocity * 2;
  };
}
function CINDX(pos) {
  return WorldSize * pos[0] + pos[1];
}
function Filter(name, propertyValue, opposite) {
  this.name = name;
  this.propertyValue = propertyValue;
  this.opposite = opposite;
  if (this.opposite === undefined) this.opposite = false;
  this.CheckFilter = function(cell) {
    if (this.name === "none" && this.opposite === false) return true;
    if (this.name === "none" && this.opposite) return false;
    if (cell[this.name] === this.propertyValue && !this.opposite) return true;
    if (cell[this.name] != this.propertyValue && this.opposite) return true;
    return false;
  };
}
function AdjCells(index, filter) {
  var x = Cells[index].x;
  var y = Cells[index].y;
  var n = [x, y + 1];
  var s = [x, y - 1];
  var e = [x + 1, y];
  var w = [x - 1, y];
  var coords = [n, e, s, w];
  var newCells = [];
  for (var i = 0; i < 4; i++) {
    if (
      CINDX(coords[i]) > 0 &&
      CINDX(coords[i]) < Cells.length &&
      filter.CheckFilter(Cells[CINDX(coords[i])])
    ) {
      newCells.push(Cells[CINDX(coords[i])]);
    }
  }
  return newCells;
}

function OnDirectionDown(dir) {
  E.Camera.TargetPos = AddVectors(E.Camera.TargetPos, dir);
}
