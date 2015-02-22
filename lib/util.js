// Stores common functions
(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  window.ExplodingNumbers.Util = {};

  // Allows for inheritance
  var inherits = ExplodingNumbers.Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function(){
      this.constructor = child;
    };
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  // Will generate velocities based on difficulty, number for blocks, and random operation
  var randomNumber = ExplodingNumbers.Util.randomNumber = function(num) {
    return Math.round(Math.random() * 9);
  };
})();
