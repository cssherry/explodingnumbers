// Stores common functions
(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  window.ExplodingNumbers.Util = {};

  // Allows for inheritance
  ExplodingNumbers.Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function(){
      this.constructor = ChildClass;
    };
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  // Will generate velocities based on difficulty, number for blocks, and random operation
  ExplodingNumbers.Util.randomNumber = function(num) {
    return Math.round(Math.random() * num);
  };

  // Merge function for hashes/objects
  ExplodingNumbers.Util.mergeHash = function(hash1, hash2) {
    var hash3 = {};
    for (var key1 in hash1) {
      hash3[key1] = hash1[key1];
    }

    for (var key2 in hash2) {
      hash3[key2] = hash2[key2];
    }

    return hash3;
  };

  ExplodingNumbers.Util.randomColor = function() {
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
  };

  ExplodingNumbers.Util.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  };
})();
