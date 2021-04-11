var rgb = function(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.str = function() {
    console.log("convert " + this);
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
  };
};
