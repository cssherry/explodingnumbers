(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Number = ExplodingNumbers.Number = function(pos){
    ExplodingNumbers.MovingObjects.call(this, pos);

    this.content = ExplodingNumbers.Util.randomNumber();
    this.color = 'grey';
    this.radius = 10;
    this.vel = ExplodingNumbers.Util.randomVec(10);
  };

  ExplodingNumbers.Util.inherits(Number, ExplodingNumbers.MovingObjects);
})();
