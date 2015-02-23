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
    this.screenOffsetY = 20; //Give canvas room for equation on top

    this.difficulty = 1;
    this.numbersOnScreen = {}; // has of numbers on the screen
    this.addInitialNumbers(); // creates this.numbers hash
    this.generateNewEquation(); // creates this.equation
    this.fallingNumbers = {};
    this.playersAnswer = [];
  };

  // Create an initial row of numbers
  Game.prototype.addInitialNumbers = function(){
    this.numbers = {};
    for (var i = 0; i < this.numColumns; i++) {
      var xPosition = (i * this.numbersHeight) + this.screenOffsetX;
      var yPosition = this.DIM_Y - (this.numbersHeight / 2);
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
    debugger
    this.equation.createEquation(this.numbersOnScreen);
  };

  // Randomly add falling numbers to the top of the page
  Game.prototype.addFallingNumbers = function(){
    var randomX = null;
    do {
      randomX = ExplodingNumbers.Util.randomNumber(this.numColumns) * this.numbersHeight + this.screenOffsetX;
    } while (!this.emptySurroundingArea([randomX, this.screenOffsetY]).emptyArea);

    var number = new ExplodingNumbers.Number([randomX, this.screenOffsetY], this.numbersHeight, this.difficulty);
    this.fallingNumbers[number.pos] = number;
    this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] + 1 || 1;
  };

  // Returns emptyArea as false if there are any numbers in surrounding area
  // returns true to bottomRow if the falling number has reached bottom row
  Game.prototype.emptySurroundingArea = function (pos) {
    var emptySurrounding = {emptyArea: true};
    for (var i = 0; i < this.height; i++) {
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
      var newPosition = [number.pos[0], number.pos[1] + 1];
      var nexMoveEmpty = this.emptySurroundingArea(newPosition);
      if (emptyQuery.bottomRow) {
        delete this.fallingNumbers[number.pos];
        this.numbers[number.pos] = number;
      } else if (emptyQuery.empty) {
        number.move();
      }
    }
  };

  // Add or remove clicked number to/from answer array
  Game.prototype.registerClickedNumber = function (pos) {
    var clickedNumber = this.numberInSurroundingArea(pos);
    var answerIndex = this.playersAnswer.indexOf(clickedNumber);
    if ( answerIndex !== -1) {
      this.clickedNumber.color = 'grey';
      this.playersAnswer.splice(answerIndex, 1);
    } else {
      this.clickedNumber.color = 'darkgrey'
      this.playersAnswer.push(clickedNumber);
    }

    if (this.correctAnswer(this.playersAnswer)) {
      return true;
    } else {
      return false;
    }
  };

  // Return number in clicked area
  Game.prototype.numberInArea = function (pos) {
    var number = null;
    for (var i = 0; i < this.numbersHeight / 2; i++) {
      var testPos1 = [pos[0], pos[1] - i];
      var testPos2 = [pos[0], pos[1] + i];
      if (this.fallingNumbers[testPos1]) {
        number = this.fallingNumbers[testPos1];
      } else if (this.fallingNumbers[testPos2]) {
        number = this.fallingNumbers[testPos1];
      } else if (this.numbers[testPos1]) {
        number = this.numbers[testPos1];
      } else if (this.numbers[testPos2]) {
        number = this.numbers[testPos2];
      }
    }
    return number;
  };

  // Check to see if an answer is right, if it is, increase difficulty by 0.1
  Game.prototype.correctAnswer = function(answer) {
    var answerString = "";
    answer.forEach(function (number) {
      answerString += number.content;
    });

    if (parseInt(answerString) === parseInt(this.equation.answer)) {
      this.removeNumbersFromScreen(answer);
      this.generateNewEquation();
      this.difficulty += 0.1;
      return true;
    } else {
      return false;
    }
  };

  // Remove clicked answers from the screen
  Game.prototype.removeNumbersFromScreen = function(answerArray) {
    answerArray.forEach(function (number) {

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
  };

  // Move numbers above clicked answers down
  Game.prototype.moveNumbersDown = function (numberPosition) {
    var newHeightX = numberPosition[0];
    var newHeightY = numberPosition[1] + this.numbersHeight;
    if (this.numbers[[newHeightX, newHeightY]]) {
      this.numbers[numberPosition] = this.numbers[[newHeightX, newHeightY]]; // Reassign number if there's something above it
      this.moveNumbersDown([newHeightX, newHeightY]);
    } else {
      delete this.numbers[numberPosition]; //Delete the number if there's nothing above it
    }
  };
})();
