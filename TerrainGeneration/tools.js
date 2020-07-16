//returns a calculated cell index
function CINDX(x, y) {
  x = Clamp(x, 0, cellCount);
  y = Clamp(y, 0, cellCount);
  return Clamp(x * cellCount + y, 0, cellCount * cellCount - 1);
}

function AdjacentCells(x, y) {
  var result = [];
  var n = CINDX(x, y + 1);
  if (n >= 0 && n < cellCount * cellCount - 1) result.push(n);
  var s = CINDX(x, y - 1);
  if (s >= 0 && s < cellCount * cellCount - 1) result.push(s);
  var e = CINDX(x + 1, y);
  if (e >= 0 && e < cellCount * cellCount - 1) result.push(e);
  var w = CINDX(x - 1, y);
  if (e >= 0 && e < cellCount * cellCount - 1) result.push(w);
  return result;
}
function GetCellWithLeastStuff(x, y) {
  var cellsm = AdjacentCells(x, y);
  var bestCell = cells[CINDX(x, y)];
  for (var i = 0; i < cellsm.length; i++) {
    if (i == 0) bestCell = cells[cellsm[i]];
    if (
      bestCell != null &&
      bestCell.additionalMatter.length >
        cells[cellsm[i]].additionalMatter.length
    )
      bestCell = cells[cellsm[i]];
  }
  return bestCell;
}
function GetNearestWater(x, y) {}
