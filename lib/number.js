(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each number has position, difficulty, content, and random velocity
  var Number = ExplodingNumbers.Number = function(pos, height, difficulty){
    ExplodingNumbers.MovingObjects.call(this, pos, height);

    this.content = ExplodingNumbers.Util.randomNumber(9);
    this.color = ExplodingNumbers.Util.randomColor();
    this.textColor = "black";
    this.vel = ExplodingNumbers.Util.randomNumber(difficulty) + 1;
  };

  // Number inherits from MovingObjects since it falls
  ExplodingNumbers.Util.inherits(Number, ExplodingNumbers.MovingObjects);
})();
