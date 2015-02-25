(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var GameView = ExplodingNumbers.GameView = function(game, canvasElement){
    this.game = game;
    this.ctx = canvasElement.getContext("2d");
    this.canvasElement = canvasElement;
    $(canvasElement).on("click", this.registerClick.bind(this));
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

  GameView.prototype.loses = function () {
    this.pauseGame();

    var posX = this.canvasElement.width / 2;
    var posY = this.canvasElement.height / 2;
    this.ctx.fillStyle = "red";
    this.ctx.font="50px Arial";
    this.ctx.fillText("Game Over. Click Anywhere to Play again", posX, posY);

    $(this.canvasElement).off("click");
    $(this.canvasElement).on("click", this.restartGame.bind(this));
  };

  GameView.prototype.restartGame = function () {
    $(this.canvasElement).off("click");
    $(this.canvasElement).on("click", this.registerClick.bind(this));

    this.canvasElement.height = window.innerHeight - 50;
    this.canvasElement.width = window.innerWidth;

    this.game = new ExplodingNumbers.Game(this.canvasElement.width, this.canvasElement.height, 10);

    this.start();
  };

  GameView.prototype.registerClick = function(event){
    var x = event.clientX;
    var y = event.clientY;

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
// Text not appearing when ending game, can't remove event handler
// On restart, very fast
