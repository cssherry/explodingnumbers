(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var GameView = ExplodingNumbers.GameView = function(game, canvasElement){
    this.game = game;
    this.ctx = canvasElement.getContext("2d");
    this.canvasElement = canvasElement;
    canvasEl.addEventListener("mousedown", this.registerClick.bind(this), false);
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

  GameView.prototype.registerClick = function(event){
    if (event.x !== undefined && event.y !== undefined) {
      x = event.x;
      y = event.y;
    } else { // Firefox method to get the position
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    this.game.registerClickedNumber([x, y]);
  };
})();

// TODO
// Clicking falling numbers doesn’t work well (Sometimes catches, sometimes doesn't)
// no end game (can’t catch exceptions)
// Numbers don't move down when they explode
