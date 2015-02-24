(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var GameView = ExplodingNumbers.GameView = function(game, canvasElement){
    this.game = game;
    this.ctx = canvasElement.getContext("2d");
  };

  GameView.prototype.start = function(){
    var that = this;
    this.game.draw(this.ctx);

    setInterval(function(){
      that.game.moveObjects();
      that.game.draw(that.ctx);
    }, 100/that.game.difficulty);

    setInterval(function(){
        that.game.addFallingNumbers();
        that.game.draw(that.ctx);
    }, ExplodingNumbers.Util.randomNumber(1200 / that.game.difficulty) + 1000 / that.game.difficulty);
  };
})();
