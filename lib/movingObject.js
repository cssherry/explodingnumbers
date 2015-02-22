(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each moving object has to be passed a position, but can optionally be passed
  // content, color, velocity, or height attributes
  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, content, color, vel, height) {
      this.pos = pos;

      this.content = content ? color : null;
      this.color = color ? color : null;
      this.vel = vel ? vel : null;
      this.height = height ? height : null;
    };

  // Moving object will be drawn on board
  MovingObjects.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.height, this.height);
    ctx.fillText(this.content, this.pos[0], this.pos[1]);
  };

  // Moving object can move down by either specified position (eg if block destroyed)
  // Or by specified velocity
  MovingObjects.prototype.move = function(distance){
    this.pos[1] += distance ? distance : this.vel;
  };
})();
