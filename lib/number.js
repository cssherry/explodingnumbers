(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Number = ExplodingNumbers.Number = function(pos, difficulty){
    ExplodingNumbers.MovingObjects.call(this, pos);

    this.content = ExplodingNumbers.Util.randomNumber(9);
    this.color = 'grey';
    this.radius = 10;
    this.vel = ExplodingNumbers.Util.randomNumber(difficulty);
  };

  ExplodingNumbers.Util.inherits(Number, ExplodingNumbers.MovingObjects);
})();
