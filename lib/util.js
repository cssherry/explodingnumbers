// Stores common functions
(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  window.ExplodingNumbers.Util = {};

  // Allows for inheritance
  var inherits = ExplodingNumbers.Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function(){};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  // Will allow for random falling speed given certain level of difficulty
  var randomVel = ExplodingNumbers.Util.randomVel = function(difficulty) {
    return Math.ceil(Math.random() * difficulty);
  };
})();
