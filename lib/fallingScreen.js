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

    this.iterationMove = 0;
    this.iterationAdd = 0;
    this.operations = ['+', '-', '*', '/'];

    // register click on canvas
    this.canvas.on('mouse:down', this.registerClick.bind(this));
  };

  GameView.prototype.populateView = function(){
    this.canvas.clear().renderAll();
    this.canvas.add(this.game.backgroundFabric);
    this.canvas.add(this.game.equation.equation);

    for (var key in this.game.fallingNumbers) {
      for (var i = 0; i < this.game.fallingNumbers[key].length; i++) {
        this.canvas.add(this.game.fallingNumbers[key][i]);
        this.game.fallingNumbers[key][i].bringToFront();
      }
    }

    for (var rowPosition in this.game.bottomRow) {
      var row = this.game.bottomRow[rowPosition];
      for (var j = 0; j < row.length; j++) {
        if (row[j]) {
          this.canvas.add(row[j]);
          row[j].bringToFront(); // need to keep bringing to front....
        }
      }
    }
  };


  GameView.prototype.start = function(){
    var that = this;
    this.movingObjects = setInterval(function(){
      if (5/that.game.difficulty < that.iterationMove) {
        that.game.moveFallingNumbers();
        that.canvas.renderAll();
        that.iterationMove = 0;
      } else {
        that.iterationMove++;
      }
    }, 20);

    this.addingNumbers = setInterval(function(){
      var interval = ExplodingNumbers.Util.randomNumber(900 / that.game.difficulty) + 20 / that.game.difficulty;
      if (interval < that.iterationAdd) {
        try {
          var newFallingNumber = that.game.addFallingNumbers().fabricObject;
          that.canvas.add(newFallingNumber);
          that.canvas.renderAll();
          newFallingNumber.bringToFront();
          that.iterationAdd = 0;
        } catch (error) {
          that.endGame("Game Over");
        }
      } else {
        that.iterationAdd++;
      }
    }, 100);

    this.gamePlay = true;
  };

  GameView.prototype.endGame = function (mainText) {
    this.pauseGame();

    var posX = this.width / 2;
    var posY = this.height / 2;

    var mainMessage = new fabric.Text(mainText, {
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

    this.canvas.add(mainMessage);
    this.canvas.add(nextMove);
    mainMessage.bringToFront();
    nextMove.bringToFront();

    this.canvas.off('mouse:down');
    this.canvas.on('mouse:down', this.restartGame.bind(this));
  };

  GameView.prototype.restartGame = function () {
    this.canvas.off('mouse:down');
    this.canvas.on('mouse:down', this.registerClick.bind(this));

    clearInterval(this.addingNumbersEnd);
    clearInterval(this.movingObjectsEnd);

    this.game = new ExplodingNumbers.Game(this.width, this.height, 10, this.operations);
    this.populateView();
    this.start();
  };

  GameView.prototype.registerClick = function(event){
    var state = this.game.registerClickedNumber(event.target);
    if (state) {
      this.inifiniteScroll();
      this.endGame(state);
    } else {
      this.populateView();
    }
  };

  GameView.prototype.inifiniteScroll = function(event){
    var that = this;
    this.canvas.clear().renderAll();
    this.canvas.add(this.game.backgroundFabric);
    this.game.fallingNumbers = [];

    this.movingObjectsEnd = setInterval(function(){
      that.game.moveObjectsEnd();
      that.canvas.renderAll();
    }, 5);

    this.addingNumbersEnd = setInterval(function(){
      var newFallingNumberEnd = that.game.addFallingNumbersEnd().fabricObject;
      that.canvas.add(newFallingNumberEnd);
      newFallingNumberEnd.sendBackwards();
      newFallingNumberEnd.sendBackwards();
      that.canvas.renderAll();
    }, 300);
  };

  GameView.prototype.pauseClick = function (event) {
    if (this.gamePlay) {
      $(event.currentTarget).html("<span class='glyphicon glyphicon-play'></span>");
      this.pauseGame();
    } else {
      $(event.currentTarget).html("<span class='glyphicon glyphicon-pause'></span>");
      this.start();
    }
  };

  GameView.prototype.pauseGame = function () {
    clearInterval(this.movingObjects);
    clearInterval(this.addingNumbers);
    this.gamePlay = false;
  };

  // Callback from clicking button
  GameView.prototype.selectOperation = function (event) {
    var currentTarget = event.currentTarget;
    var id = currentTarget.getAttribute('id');
    if ($(currentTarget).hasClass("active")) {
      if (this.operations.length > 1) {
        var index = this.operations.indexOf(id);
        this.operations.splice(index, 1);
        this.changeView($(currentTarget));
      }
    } else {
      this.operations.push(id);
      this.changeView($(currentTarget));
    }

  };

  GameView.prototype.changeView = function ($target) {
    $target.toggleClass("btn-default btn-success active");
    this.game.operations = this.operations;
    this.game.equation = this.game.generateNewEquation(this.operations);
    this.populateView();
  };
})();
