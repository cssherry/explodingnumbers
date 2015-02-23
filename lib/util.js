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
    return Math.round(Math.random() * 9);
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


})();
