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

    this.movingObjects = setInterval(function(){
      that.game.moveObjects();
      that.game.draw(that.ctx);
    }, 200/that.game.difficulty);

    this.addingNumbers = setInterval(function(){
        that.game.addFallingNumbers();
        that.game.draw(that.ctx);
    }, ExplodingNumbers.Util.randomNumber(6000 / that.game.difficulty) + 6000 / that.game.difficulty);

    this.gamePlay = true;
  };

  GameView.prototype.registerClick = function(event){
    if (event.x !== undefined && event.y !== undefined) {
      x = event.clientX;
      y = event.clientY;
    } else { // Firefox method to get the position
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    this.game.registerClickedNumber([x, y]);
  };

  GameView.prototype.pauseClick = function (event) {
    if (this.gamePlay) {
      this.pauseGame();
    } else {
      this.start();
    }
  };

  GameView.prototype.pauseGame = function () {
    clearInterval(this.movingObjects);
    clearInterval(this.addingNumbers);
    this.gamePlay = false;
  };
})();

// TODO
// Clicking falling numbers doesn’t work well (Sometimes catches, sometimes doesn't)
// no end game (can’t catch exceptions)
