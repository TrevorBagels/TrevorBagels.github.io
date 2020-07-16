//generate a world of some sort
GenerateLandscape(30, 30, 0.5);
function GenerateLandscape(l, h, steepness) {
  var lastY = Rand(0, h / 2);
  for (var x = 0; x < l; x++) {
    var newY = lastY + Rand(-steepness, steepness);
    lastY = newY;
    for (var y = 0; y < newY; y++) {
      var g = new E.Obj([x, y], 0);
      if (y == newY - 1) {
        P.SetAsSolid(g);
      }
    }
  }
}
for (var i = 0; i < 26; i++) {
  var t = new E.Obj([i, 15 + Rand(-3, 3)], 0, new rgb(255, 5, 123));
  P.SetAsLiquid(t);
}
