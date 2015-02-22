(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Game = ExplodingNumbers.Game = function(dimX, dimY, numColumns){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.numColumns = numColumns;

    this.difficulty = 1;
    this.generateNewEquation(); // creates this.equation
    this.addInitialNumbers(); // creates this.numbers hash
    this.fallingNumbers = {};
  };

  // Create an initial row of numbers
  Game.prototype.addInitialNumbers = function(){
    this.numbers = [];
    for (var i = 0; i < this.numColumns; i++) {
      var number = new ExplodingNumbers.Number([i * this.DIM_Y, this.DIM_Y], 10, this.difficulty);
      this.numbers[number.pos] = number;
    }
  };

  // Extract out method for making new equation so it can be run on initialize and
  // upon answering correctly
  Game.prototype.generateNewEquation = function () {
    this.equation = new ExplodingNumbers.Equation(this.difficulty);
    this.equation.createEquation();
  };

  // Randomly add falling numbers to the top of the page
  Game.prototype.addFallingNumbers = function(){
    var randomX = null;
    do {
      randomX = ExplodingNumbers.Util.randomNumber(this.DIM_X);
    } while (!this.emptySurroundingArea(10, [randomX, 0]).emptyArea);

    var number = new ExplodingNumbers.Number([randomX, 0], 10, this.difficulty);
    this.fallingNumbers[number.pos] = number;
  };

  // Returns emptyArea as false if there are any numbers in surrounding area
  // returns true to bottomRow if the falling number has reached bottom row
  Game.prototype.emptySurroundingArea = function (length, pos) {
    var emptySurrounding = {emptyArea: true};
    for (var i = 0; i < length; i++) {
      var testPos = [pos[0] + i, pos[1]];
      if (this.fallingNumbers[testPos]) {
        emptySurrounding.emptyArea = false;
      }
      if (this.numbers[testPos]) {
        emptySurrounding.bottomRow = true;
        emptySurrounding.emptyArea = false;
      }
    }
    return emptySurrounding;
  };

  // Draw the current state of the game
  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

    for (var numbersPos in this.numbers) {
      this.numbers[numbersPos].draw(ctx);
    }

    for (var fallingNumbersPos in this.fallingNumbers) {
      this.fallingNumbers[fallingNumbersPos].draw(ctx);
    }
  };

  // Move all falling numbers if nothing is blocking it's way
  Game.prototype.moveObjects = function() {
    this.fallingNumbers.forEach(function(number) {
      var emptyQuery = this.emptySurroundingArea(10, number.pos);
      if (emptyQuery.bottomRow) {
        delete this.fallingNumbers[number.pos];
        this.numbers[number.pos] = number;
      } else if (emptyQuery.empty) {
        number.move();
      }
    });
  };

  // Check to see if an answer is right, if it is, increase difficulty by 0.1
  Game.prototype.correctAnswer = function(answer) {
    if (answer === this.equation.answer) {
      this.generateNewEquation();
      this.difficulty += 0.1;
      return true;
    } else {
      return false;
    }
  };
})();
