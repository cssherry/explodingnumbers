(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var GameView = ExplodingNumbers.GameView = function(game, canvasId, width, height){
    this.game = game;
    this.canvas = new fabric.Canvas(canvasId);
    this.width = width;
    this.height = height;


    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.populateView();

    // register click on canvas
    this.canvas.on('mouse:down', this.registerClick.bind(this));
  };

  GameView.prototype.populateView = function(){
    this.canvas.add(this.game.backgroundFabric);

    for (var i = 0; i < this.game.fallingNumbers.length; i++) {
      this.canvas.add(this.game.fallingNumbers[i].fabricObject);
    }

    for (var rowPosition in this.game.bottomRow) {
      var row = this.game.bottomRow[rowPosition];
      for (var j = 0; j < row.length; j++) {
        this.canvas.add(row[j].fabricObject);
      }
    }

    this.canvas.add(this.game.equation.equation);

    this.canvas.renderAll();
  };


  GameView.prototype.start = function(){
    var that = this;
    this.movingObjects = setInterval(function(){
      that.game.moveObjects();
      that.canvas.renderAll();
    }, 40/that.game.difficulty);

    this.addingNumbers = setInterval(function(){
      try {
        var newFallingNumber = that.game.addFallingNumbers().fabricObject;
        that.canvas.add(newFallingNumber);
        that.canvas.renderAll();
      } catch (error) {
        that.loses();
      }
    }, ExplodingNumbers.Util.randomNumber(6000 / that.game.difficulty) + 2000 / that.game.difficulty);

    this.gamePlay = true;
  };

  GameView.prototype.loses = function () {
    this.pauseGame();

    var posX = this.width / 2;
    var posY = this.height / 2;

    var endGameText = new fabric.Text("Game Over", {
      fontSize: 50,
      fill: 'darkred',
      top: posY - 60,
      left: posX * 0.7,
      strokeWidth: 0.5,
      stroke: "white",
      selectable: false,
    });

    var nextMove = new fabric.Text("Click Anywhere to Play again.", {
      fontSize: 20,
      fill: 'darkred',
      top: posY,
      left: posX * 0.7,
      strokeWidth: 0.2,
      stroke: "white",
      selectable: false,
    });

    this.canvas.add(endGameText);
    this.canvas.add(nextMove);

    this.canvas.off('mouse:down');
    this.canvas.on('mouse:down', this.restartGame.bind(this));
  };

  GameView.prototype.restartGame = function () {
    this.canvas.off('mouse:down');
    this.canvas.on('mouse:down', this.registerClick.bind(this));

    this.canvas.clear().renderAll();
    this.game = new ExplodingNumbers.Game(this.width, this.height, 10);
    this.populateView();
    this.start();
  };

  GameView.prototype.registerClick = function(event){
    this.game.registerClickedNumber(event.target);
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
// Numbers not falling all the way, move function?
