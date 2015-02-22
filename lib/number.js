(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // Each number has position, difficulty, content, and random velocity
  var Number = ExplodingNumbers.Number = function(pos, difficulty){
    ExplodingNumbers.MovingObjects.call(this, pos);

    this.content = ExplodingNumbers.Util.randomNumber(9);
    this.color = 'grey';
    this.height = 10;
    this.vel = ExplodingNumbers.Util.randomNumber(difficulty);
  };

  // Number inherits from MovingObjects since it falls
  ExplodingNumbers.Util.inherits(Number, ExplodingNumbers.MovingObjects);
})();
