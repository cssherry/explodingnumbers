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
    // setInterval(function(){
    //   that.game.draw(that.ctx);
    // }, 20);
    // setInterval(function(){
    //     that.game.addFallingNumbers();
    //     that.game.draw(that.ctx);
    // }, 60);
  };
})();
