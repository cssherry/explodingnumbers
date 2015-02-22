(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, vel, height, color, content) {
      this.pos = pos;
      this.vel = vel;
      this.height = height;
      this.color = color;
      this.content = content;
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
