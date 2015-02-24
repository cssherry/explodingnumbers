(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Game = ExplodingNumbers.Game = function(dimX, dimY, numColumns){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.numColumns = numColumns;

    this.numbersHeight = (this.DIM_X * 3) / (this.numColumns * 5); // height and width of each number
    this.screenOffsetX = (this.DIM_X * 1)/ 5; //Give canvas some space on the left
    this.screenOffsetY = 20 + this.numbersHeight; //Give canvas room for equation on top

    this.difficulty = 1;
    this.numbersOnScreen = {}; // has of numbers on the screen
    this.addInitialNumbers(); // creates this.numbers hash
    this.generateNewEquation(); // creates this.equation
    this.fallingNumbers = {};
    this.playersAnswer = [];
    this.addFallingNumberTries = 0;
  };

  // Create an initial row of numbers
  Game.prototype.addInitialNumbers = function(){
    this.numbers = {};
    for (var i = 0; i < this.numColumns; i++) {
      var xPosition = Math.floor((i * this.numbersHeight) + this.screenOffsetX);
      var yPosition = Math.floor(this.DIM_Y - (this.numbersHeight / 2));
      var number = new ExplodingNumbers.Number([xPosition, yPosition], this.numbersHeight, this.difficulty);
      this.numbers[number.pos] = number;
      this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] + 1 || 1;
    }
  };

  // Extract out method for making new equation so it can be run on initialize and
  // upon answering correctly
  Game.prototype.generateNewEquation = function () {
    var equationPosition = [this.DIM_X / 2, 15];
    this.equation = new ExplodingNumbers.Equation(this.difficulty, equationPosition);
    this.equation.createEquation(this.numbersOnScreen);
  };

  // Randomly add falling numbers to the top of the page
  Game.prototype.addFallingNumbers = function(){
    var randomX = null;
    this.addFallingNumberTries = 0;
    do {
      if(this.addFallingNumberTries > 20) throw "screenIsFull"; // Throw error if all the positions are full
      this.addFallingNumberTries++;
      randomX = Math.floor(ExplodingNumbers.Util.randomNumber(this.numColumns - 1) * this.numbersHeight + this.screenOffsetX);
    } while (!this.emptySurroundingArea([randomX, Math.floor(this.screenOffsetY)]).emptyArea);

    var number = new ExplodingNumbers.Number([randomX, Math.floor(this.screenOffsetY)], this.numbersHeight, this.difficulty);
    this.fallingNumbers[number.pos] = number;
    this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] + 1 || 1;
  };

  // Returns emptyArea as false if there are any numbers in surrounding area
  // returns true to bottomRow if the falling number has reached bottom row
  Game.prototype.emptySurroundingArea = function (pos) {
    var emptySurrounding = {emptyArea: true};
    for (var i = 0; i < this.numbersHeight - 1; i++) {
      var testPos1 = [pos[0], pos[1] + i];
      var testPos2 = [pos[0] + i, pos[1]];
      if (this.fallingNumbers[testPos1] || this.fallingNumbers[testPos2]) {
        emptySurrounding.emptyArea = false;
      }
      if (this.numbers[testPos1] || this.numbers[testPos2]) {
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

    this.equation.draw(ctx);
  };

  // Move all falling numbers if nothing is blocking it's way
  Game.prototype.moveObjects = function() {
    for (var fallingNumbersPos in this.fallingNumbers) {
      var number = this.fallingNumbers[fallingNumbersPos];
      var newPosition = [number.pos[0], number.pos[1] + number.vel];
      var nextMoveEmpty = this.emptySurroundingArea(newPosition);
      if (nextMoveEmpty.bottomRow || Math.floor(this.DIM_Y - (this.numbersHeight / 2)) < newPosition[1]) {
        delete this.fallingNumbers[number.pos];
        this.numbers[number.pos] = number;
      } else if (nextMoveEmpty.emptyArea) {
        delete this.fallingNumbers[number.pos];
        this.fallingNumbers[newPosition] = number;
        number.move();
      }
    }
  };

  // Add or remove clicked number to/from answer array
  Game.prototype.registerClickedNumber = function (pos) {
    var clickedNumber = this.numberInSurroundingArea(pos);
    var answerIndex = this.playersAnswer.indexOf(clickedNumber);
    if (!clickedNumber) {
      return;
    } else if ( answerIndex !== -1) {
      clickedNumber.color = 'grey';
      this.playersAnswer.splice(answerIndex, 1);
    } else {
      clickedNumber.color = 'darkgrey'
      this.playersAnswer.push(clickedNumber);
    }

    if (this.correctAnswer()) {
      return true;
    } else {
      return false;
    }
  };

  // Return number in clicked area
  Game.prototype.numberInSurroundingArea = function (pos) {
    var number = null;
    for (var i = 0; i < this.numbersHeight / 2; i++) {
      for (var j = 0; j < this.numbersHeight + 20; j++) {
        var testPos1 = [pos[0] + i, pos[1] + j];
        var testPos2 = [pos[0] - i, pos[1] + j];

        if (this.fallingNumbers[testPos1]) {
          number = this.fallingNumbers[testPos1];
        } else if (this.numbers[testPos1]) {
          number = this.numbers[testPos1];
        } else if (this.fallingNumbers[testPos2]) {
          number = this.fallingNumbers[testPos2];
        } else if (this.numbers[testPos2]) {
          number = this.numbers[testPos2];
        }
      }
    }
    return number;
  };

  // Check to see if an answer is right, if it is, increase difficulty by 0.1
  Game.prototype.correctAnswer = function() {
    var answerString = "";
    this.playersAnswer.forEach(function (number) {
      answerString += number.content;
    });

    if (parseInt(answerString) === parseInt(this.equation.answer)) {
      this.removeNumbersFromScreen();
      this.generateNewEquation();
      this.difficulty += 0.1;
      return true;
    } else {
      return false;
    }
  };

  // Remove clicked answers from the screen
  Game.prototype.removeNumbersFromScreen = function() {
    this.playersAnswer.forEach(function (number) {

      // Delete the number from hash of numbers on the screen if 1, otherwise, subtract 1
      if (this.numbersOnScreen[number.content] === 1) {
        delete this.numbersOnScreen[number.content];
      } else {
        this.numbersOnScreen[number.content] -= 1;
      }

      // Delete the number from either the hash of numbers or falling numbers
      if (this.numbers[number.pos]) {
        this.moveNumbersDown(number.pos);
      } else {
        delete this.fallingNumbers[number.pos];
      }
    }.bind(this));
    this.playersAnswer = [];
  };

  // Move numbers above clicked answers down or simply delete number
  Game.prototype.moveNumbersDown = function (numberPosition) {
    var higherNumber = this.getHigherNumber(numberPosition);
    if (higherNumber) {
      this.moveNumbers(numberPosition, higherNumber);
    } else {
      delete this.numbers[numberPosition]; //Delete the number if there's nothing above it
    }
  };

  // recursively move higher numbers down
  Game.prototype.moveNumbers = function (numberPosition, number) {
    var oldHeight = number.pos;
    number.move(-Math.floor(this.numbersHeight));
    this.numbers[numberPosition] = number;

    var higherNumber = this.getHigherNumber(number.pos);
    if (higherNumber) {
      this.moveNumbers(oldHeight, higherNumber);
    }
  };

  Game.prototype.getHigherNumber = function (numberPosition) {
    var newHeightX = numberPosition[0];
    var newHeightY1 = numberPosition[1] - Math.floor(this.numbersHeight);
    var newHeightY2 = newHeightY1 - 1;
    return this.numbers[[newHeightX, newHeightY1]] || this.numbers[[newHeightX, newHeightY2]];
  };
})();
