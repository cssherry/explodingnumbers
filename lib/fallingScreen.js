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
    }, 40/that.game.difficulty);

    this.addingNumbers = setInterval(function(){
      try {
        that.game.addFallingNumbers();
      } catch (error) {
        that.loses();
      }
        that.game.draw(that.ctx);
    }, ExplodingNumbers.Util.randomNumber(6000 / that.game.difficulty) + 2000 / that.game.difficulty);

    this.gamePlay = true;
  };

  GameView.prototype.loses = function (error) {
    this.pauseGame();

    var posX = this.canvasElement.width / 2;
    var posY = this.canvasElement.height / 2;
    this.ctx.fillStyle = "red";
    this.ctx.font="50px Arial";
    this.ctx.fillText("Game Over", posX - 50, posY);
    this.ctx.font="20px Arial";
    this.ctx.fillText("Click Anywhere to Play again", posX - 100, posY + 50);

    this.canvasElement.addEventListener("mousedown", this.restartGame.bind(this), false);
  };

  GameView.prototype.restartGame = function () {
    this.canvasElement.removeEventListener("mousedown", this.restartGame.bind(this), false);

    canvasEl.height = window.innerHeight - 50;
    canvasEl.width = window.innerWidth;

    this.game = new ExplodingNumbers.Game(canvasEl.width, canvasEl.height, 10);

    this.start();
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
      $(event.currentTarget).text("Restart Game");
      this.pauseGame();
    } else {
      $(event.currentTarget).text("Pause Game");
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
