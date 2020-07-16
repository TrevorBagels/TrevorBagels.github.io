var Cells = [];
var WorldSize = 25;
GenerateCells();
function GenerateCells() {
  for (var i = 0; i < WorldSize * WorldSize; i++) {
    Cells.push(new Cell(i));
  }
}

function Cell(index) {
  this.index = index;
  this.x = Math.floor(index / WorldSize);
  this.y = index - this.x * WorldSize;
  this.pos = [this.x, this.y];
  this.vis = new E.Obj(this.pos, 0, new rgb(100, 100, 100));
}
function CINDX(pos) {
  return Data.WorldSize * pos[0] + pos[1];
}

function AdjCells(index) {
  var x = Cells[index].x;
  var y = Cells[index].y;
  var n = [x, y + 1];
  var s = [x, y - 1];
  var e = [x + 1, y];
  var w = [x - 1, y];
  var coords = [n, e, s, w];
  var newCells = [];
  for (var i = 0; i < 4; i++) {
    if (!CINDX(coords[i]) < 0 && !CINDX(coords[i]) >= Cells.length) {
      newCells.push(Cells[CINDX(coords[i])]);
    }
  }
  return newCells;
}
