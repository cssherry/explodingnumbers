(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Equation = ExplodingNumbers.Equation = function(difficulty, game){
    this.difficulty = difficulty;
    this.game = game;
    this.operations = ['+', '-', '*', '/'];
  };

  Equation.prototype.findOperation = function() {
    var operationIndex = ExplodingNumbers.Util.randomNumber(3);
    return this.operations[operationIndex];
  };
})();
