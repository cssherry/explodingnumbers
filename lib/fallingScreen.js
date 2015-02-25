(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var GameView = ExplodingNumbers.GameView = function(game, canvasId){
    this.game = game;
    this.canvas = new fabric.Canvas(canvasId);
    this.populateView();
    // $(canvasElement).on("click", this.registerClick.bind(this));
  };

  GameView.prototype.populateView = function(){
    for (var i = 0; i < this.game.numbers.length; i++) {
      this.canvas.add(this.game.numbers[i]);
    }
  };

  this.canvas.renderAll();

  ///////////////////////////////////
  // Old script
  ///////////////////////////////////

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
        that.game.draw(that.ctx);
      } catch (error) {
        that.loses();
      }
    }, ExplodingNumbers.Util.randomNumber(6000 / that.game.difficulty) + 2000 / that.game.difficulty);

    this.gamePlay = true;
  };

  GameView.prototype.loses = function () {
    this.pauseGame();

    var posX = this.canvasElement.width / 2;
    var posY = this.canvasElement.height / 2;
    this.ctx.fillStyle = "red";
    this.ctx.strokeStyle = "white";
    this.ctx.font="50px Arial";
    this.ctx.fillText("Game Over", posX * 0.8, posY);
    this.ctx.font="20px Arial";
    this.ctx.fillText("Click Anywhere to Play again.", posX * 0.8, posY + 40);

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
