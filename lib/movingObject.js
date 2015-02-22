(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, content, color, vel, height) {
      this.pos = pos;

      this.content = content ? color : null;
      this.color = color ? color : null;
      this.vel = vel ? vel : null;
      this.height = height ? height : null;
    };

  MovingObjects.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.height, this.height);
    ctx.fillText(this.content, this.pos[0], this.pos[1]);
  };

  MovingObjects.prototype.move = function(){
    this.pos[0] += this.vel;
  };
})();
