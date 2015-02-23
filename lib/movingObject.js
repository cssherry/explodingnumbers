(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each moving object has to be passed a position, but can optionally be passed
  // content, color, velocity, or height attributes
  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, height, content, color, vel) {
      this.pos = pos;
      this.height = height;

      this.content = content ? color : null;
      this.color = color ? color : null;
      this.vel = vel ? vel : null;
    };

  // Moving object will be drawn on board
  MovingObjects.prototype.draw = function(ctx) {
    this.drawRectangle(ctx);
    this.drawNumber(ctx);
  };

  // Make the underlying rectangle
  MovingObjects.prototype.drawRectangle = function(ctx){
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'lightgrey';
    var rectangleOffset = this.height / 2;
    var xPosition = this.pos[0] - rectangleOffset;
    var yPosition = this.pos[1] - rectangleOffset;
    ctx.fillRect(xPosition, yPosition, this.height, this.height);
    ctx.strokeRect(xPosition, yPosition, this.height, this.height);
  };

  // Make the numbers
  MovingObjects.prototype.drawNumber = function(ctx){
    ctx.fillStyle = "black";
    ctx.fillText(this.content, this.pos[0], this.pos[1]);
  };

  // Moving object can move down by either specified position (eg if block destroyed)
  // Or by specified velocity
  MovingObjects.prototype.move = function(distance){
    this.pos[1] += distance ? distance : this.vel;
  };
})();
