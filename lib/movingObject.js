(function() {
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each moving object has to be passed a position, but can optionally be passed
  // content, color, velocity, or height attributes
  var MovingObjects = ExplodingNumbers.MovingObjects = function (pos, height, content, color, textColor, vel) {
      this.pos = pos;
      this.height = height;

      this.content = content ? content : null;
      this.color = color ? color : null;
      this.textColor = textColor ? textColor : null;
      this.vel = vel ? vel : null;
    };

  // Create the fabric object group
  MovingObjects.prototype.createObject = function() {
    var rect = this.createRectangle();
    var text = this.createText();

    // var rectangleOffset = this.height / 2;
    var xPosition = this.pos[0]; //- rectangleOffset;
    var yPosition = this.pos[1]; //- rectangleOffset;

    this.fabricObject = new fabric.Group([ rect, text ], {
      left: xPosition,
      top: yPosition,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
      selectable: false
    });

    return this.fabricObject;
  };

  // Create text part of group
  MovingObjects.prototype.createText = function() {
    return new fabric.Text(this.content.toString(), {
      fontSize: 14,
      fill: this.textColor,
      originX: 'center',
      originY: 'center',
    });
  };

  // Create rectangle part of group
  MovingObjects.prototype.createRectangle = function() {
    return new fabric.Rect({
      originX: 'center',
      originY: 'center',
      fill: this.color,
      width: this.height,
      height: this.height,
      rx: 10,
      ry: 10,
      strokeWidth: 1,
      stroke: "lightgrey",
    });
  };

  // Move object down by either specified distance or by velocity
  MovingObjects.prototype.moveDown = function(distance){
    var newPosition = distance ? this.fabricObject.top + distance : this.fabricObject.top + this.vel;
    this.fabricObject.set({ top: newPosition });
  };

  // Simple way to get position of object
  MovingObjects.prototype.position = function(){
    var x = this.fabricObject.left,
        y = this.fabricObject.top;
    return [x, y];
  };
})();
