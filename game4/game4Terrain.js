var chunkSize = 500;
var chunkHeight = 70;
var intensity = 1;
var avgCaveHeight = 0;
var tiles = [];
var tiles2d = [];
//make tiles
for (var x = 0; x < chunkSize; x++) {
  tiles2d.push([]);
  for (var y = 0; y < chunkHeight; y++) {
    var t = new Tile([x, y]);
    tiles2d[x].push(t);
  }
}
//GenerateWorld();

//generates the seed

function GenerateChunk(X) {
  var tileData = []; //index = x, value = y

  for (var i = 0; i < 2; i++) {
    //step 1: generate heights
    if (i == 0) {
      var currentdir = 0;
      var currentY = IN.rand(
        chunkHeight - chunkHeight / 2,
        chunkHeight - chunkHeight / 5
      );
      for (var x = 0; x < chunkSize; x++) {
        //generate a random height
        if (IN.rand(1, 10) == 4) {
          //switch direction
          if (IN.rand(1, 2) == 1) {
            currentdir = -intensity;
          } else {
            currentdir = 0;
          }
        }
        currentY += IN.clamp(
          IN.rand(-intensity, intensity),
          currentdir,
          chunkHeight
        );
        currentY = IN.clamp(currentY, 0, chunkHeight - 1);
        tileData.push(currentY);
        //var o = new M.Obj([x, currentY]);
      }
    }
    if (i == 1) {
      for (var x = 0; x < chunkSize; x++) {
        var height = tileData[x];
        tiles.push([]);
        tiles[x].push(y);
        for (var y = 0; y < height; y++) {
          //console.log(y);
          var top = y === height - 1;
          if (!(!tiles2d[x][y].air && y > IN.rand(5, 15))) {
            var o = new M.Obj([X * chunkSize + x, y]);
            o.color = "brown";
            if (top) o.color = "green";
          }
        }
      }
    }
    console.log(tileData);
  }
}
function GenerateCaveData() {
  var pnoise = PNoise();
  var newThresh = thresh + avgCaveHeight / 10;
  var greaterThan = true;
  if (avgCaveHeight - 30 > newThresh) greaterThan = false;
  for (var i = 0; i < pnoise.length; i++) {
    for (var y = 0; y < pnoise[i].length; y++)
      if (
        (pnoise[i][y].he > newThresh && greaterThan) ||
        (pnoise[i][y].he < newThresh && !greaterThan)
      ) {
        tiles2d[pnoise[i][y].pos[0]][pnoise[i][y].pos[1]].air = true;
        new M.Obj([x * 4, y * 4]);
      }
    //tiles2d[pnoise[i].pos[0]][pnoise[i].pos[1]].air = true;
  }
}
function GenerateWorld() {
  for (var x = 0; x < M.World.Size[0]; x++) {
    M.CollisionObjs2D.push([]);
    for (var y = 0; y < M.World.Size[1]; y++) {
      M.CollisionObjs2D[x].push(null);
    }
  }
}

function Tile(pos) {
  this.pos = pos;
  this.empty = true;
  this.air = false; //used when making caves
}
var thresh = 235;
Srand.seed(Date.now());
var pNoiseSteepness = 5;
GenerateCaveData();

function PNoise() {
  var pNoiseData = [];
  var pNoiseData2 = [];
  for (var x = 0; x < chunkSize; x++) {
    pNoiseData.push([]);
    for (var y = 0; y < chunkHeight; y++) {
      //var o = new M.Obj([x, y], 0);
      var h = 0;
      var increment = IN.rand(-pNoiseSteepness, pNoiseSteepness);
      if (x == 0 && y == 0) h = IN.rand(1, 255); //generates h (fisrt time gen)
      //similar to the height below it. get color below it and add a small value to it
      if (x == 0 && y !== 0) {
        h = pNoiseData[x][y - 1].he + increment;
      }
      if (x > 0) {
        if (y == 0) h = pNoiseData[x - 1][y].he + increment;
        if (y > 0)
          h =
            (pNoiseData[x - 1][y].he + pNoiseData[x][y - 1].he) / 2 + increment;
      }

      //o.color = new rgb(h, h, h).toStr();
      //thresh
      var tl = { he: h, pos: [x, y] };
      avgCaveHeight += h;
      pNoiseData[x].push(tl);
      if (h <= thresh) pNoiseData2.push(tl);
      if (h > thresh) {
        //o.enabled = false;
        //console.log("thresh poof");
      }
    }
  }
  avgCaveHeight /= chunkSize * chunkHeight;
  return pNoiseData;
}
GenerateChunk(0);
