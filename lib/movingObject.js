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

    var rectangleOffset = this.height / 2;
    var xPosition = this.pos[0] - rectangleOffset;
    var yPosition = this.pos[1] - rectangleOffset;

    this.fabricObject = new fabric.Group([ text, rect ], {
      left: xPosition,
      top: yPosition,
    });

    return this.fabricObject;
  };

  MovingObjects.prototype.createText = function() {
    return new fabric.Text(this.content, {
      fontSize: 14,
      fill: this.textColor,
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
      ry: 10,
      strokeWidth: 2,
      stroke: "lightgrey"
    });
  };

  MovingObjects.prototype.move = function(distance){
    var newPosition = distance ? this.fabricObject.top + distance : this.fabricObject.top + this.vel;
    rect.set({ top: newPosition });
  };
})();
