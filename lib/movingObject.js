(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each moving object has to be passed a position, but can optionally be passed
  // content, color, velocity, or height attributes
  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, height, content, color, textColor, vel) {
      this.height = height;

      this.content = content ? color : null;
      this.color = color ? color : null;
      this.textColor = textColor ? textColor : null;
      this.vel = vel ? vel : null;

      this.createObject(pos);
    };

  MovingObjects.prototype.createObject = function(pos) {
    var rect = this.createRectangle();
    var text = this.createText();

    this.fabricObject = new fabric.Group([ text, rect ], {
      left: pos[0],
      top: pos[1],
    });

    return this.fabricObject;
  };

  MovingObjects.prototype.createText = function() {
    return new fabric.Text(this.content, {
      fontSize: 14,
      originX: 'center',
      originY: 'center'
    });
  };

  MovingObjects.prototype.createRectangle = function() {
    return new fabric.Rect({
      originX: 'center',
      originY: 'center',
      fill: this.color,
      width: this.height,
      height: this.height,
      rx: 10,
      ry: 10
    });
  };



    ///////////////////////////////////
    // Old script
    ///////////////////////////////////

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
    ExplodingNumbers.Util.roundRect(ctx, xPosition, yPosition, this.height, this.height, 10, true, true);
  };

  // Make the numbers
  MovingObjects.prototype.drawNumber = function(ctx){
    ctx.fillStyle = this.textColor;
    ctx.font="14px Arial";
    ctx.fillText(this.content, this.pos[0], this.pos[1]);
  };

  // Moving object can move down by either specified position (eg if block destroyed)
  // Or by specified velocity
  MovingObjects.prototype.move = function(distance){
    this.pos[1] += distance ? distance : this.vel;
  };
})();
