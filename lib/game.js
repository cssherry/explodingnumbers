(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Game = ExplodingNumbers.Game = function(dimX, dimY, numColumns){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.numColumns = numColumns;
    this.difficulty = 1;

    this.numbersHeight = Math.floor(this.DIM_X / this.numColumns) ; // height and width of each number
    this.screenOffsetY = 25; //Give canvas room for equation on top
    this.bottomYPosition = Math.floor(this.DIM_Y - this.numbersHeight - 2); //Define this here to be used when making initial row and assigning floor numbers

    this.backgroundFabric = new fabric.Rect({ fill: "black",
                                              width: this.numbersHeight * numColumns,
                                              height: dimY ,
                                              top: 0,
                                              left: 0,
                                              selectable: false });

    this.numbersOnScreen = {}; // hash of numbers on the screen
    this.bottomRow = {}; // columns and their items, initially as fabric groups, but that was too difficult
    this.fallingNumbers = []; // for making sure falling numbers don't intersect
    this.addInitialNumbers(); // populates this.fixedNumbersTopLayer array
    this.playersAnswer = []; //stores player's answers
    this.addFallingNumberTries = 0; // detect when numbers are having trouble falling

    this.equation = new ExplodingNumbers.Equation(this.difficulty, this.numbersOnScreen, this.DIM_X / 2 - 10);
  };

  // Create an initial row of numbers
  Game.prototype.addInitialNumbers = function(){
    this.numbers = {};
    for (var i = 0; i < this.numColumns; i++) {
      var xPosition = Math.floor((i * this.numbersHeight));
      var number = new ExplodingNumbers.Number([xPosition, this.bottomYPosition], this.numbersHeight, this.difficulty);

      this.bottomRow[xPosition] = [number];
      this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] + 1 || 1;
    }
  };

  // Randomly add falling numbers to the top of the page
  Game.prototype.addFallingNumbers = function(){
    var randomX = null;
    this.addFallingNumberTries = 0;
    do {
      if(this.addFallingNumberTries > 30) throw "screenIsFull"; // Throw error ending game if all the positions are full
      randomX = Math.floor(ExplodingNumbers.Util.randomNumber(this.numColumns - 1) * this.numbersHeight); // have to shift by 4 so doesn't intersect with nearby number
      this.addFallingNumberTries++;
    } while (this.collidesWithOtherNumber([randomX, this.screenOffsetY]));

    this.fallingNumbers.push(this.newNumber);
    this.numbersOnScreen[this.newNumber.content] = this.numbersOnScreen[this.newNumber.content] + 1 || 1;
    return this.newNumber;
  };

  // Returns true if there are any numbers in surrounding area
  Game.prototype.collidesWithOtherNumber = function (pos, currentFallingPosition) {
    this.newNumber = new ExplodingNumbers.Number(pos, this.numbersHeight, this.difficulty);
    if (this.findBottomRow(pos)) {
      return true;
    }

    for (var j = 0; j < this.fallingNumbers.length; j++) {
      // skip current number if it's specified
      if (j !== currentFallingPosition) {
        if (this.newNumber.fabricObject.intersectsWithObject(this.fallingNumbers[j].fabricObject)) {
          return true;
        }
      }
    }

    return false;
  };

  // Move all falling numbers if nothing is blocking it's way
  Game.prototype.moveObjects = function() {
    for (var j = 0; j < this.fallingNumbers.length; j++) {
      var number = this.fallingNumbers[j];
      var newPosition = [number.fabricObject.left, number.fabricObject.top + number.vel];
      var bottomRowItem = this.findBottomRow(newPosition);

      if (bottomRowItem) {
        this.fallingNumbers.splice(j, 1);
        if (this.bottomRow[number.pos[0]]) {
          this.bottomRow[number.pos[0]].push(number);
        } else {
          this.bottomRow[number.pos[0]] = [number];
        }
      } else if (!this.collidesWithOtherNumber(newPosition, j)) {
        number.moveDown();
      }
    }
  };

  // returns true if the falling number has reached bottom row
  Game.prototype.findBottomRow = function (pos) {
    // For some reason, if fabric objects are grid-aligned, neighboring objects will throw true to intersectsWithObject
    var testNumber = new ExplodingNumbers.Number([pos[0] + 4, pos[1]], this.numbersHeight - 4, this.difficulty);

    var currentColumn = this.bottomRow[pos[0]];
    var numberOfItems = currentColumn.length;

    if (this.bottomYPosition - (numberOfItems * this.numbersHeight) < pos[1]) { // third test when there's an empty column or column > 2 item
      debugger;
      return currentColumn;
    }

    return false;
  };

  // Add or remove clicked number to/from answer array
  Game.prototype.registerClickedNumber = function (clickedNumber) {
    var answerIndex = this.playersAnswer.indexOf(clickedNumber);

    if ( answerIndex !== -1) { //Unselect number
      clickedNumber.color = clickedNumber.oldColor;
      this.playersAnswer.splice(answerIndex, 1);
      clickedNumber.textColor = "black";
    } else { // Select number
      clickedNumber.oldColor = clickedNumber.color;
      clickedNumber.color = '#343434';
      this.playersAnswer.push(clickedNumber);
      clickedNumber.textColor = 'white';
    }

    if (this.correctAnswer()) {
      return true;
    } else {
      return false;
    }
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
        this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] - 1;
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
    delete this.numbers[numberPosition]; //Delete the number

    var higherNumber = this.getHigherNumber(numberPosition);
    if (higherNumber) {
      this.moveNumbers(numberPosition, higherNumber);
    }
  };

  // recursively move higher numbers down
  Game.prototype.moveNumbers = function (numberPosition, number) {
    var oldPosition = number.pos;
    number.pos = numberPosition;
    this.numbers[numberPosition] = number;

    var higherNumber = this.getHigherNumber(oldPosition);
    if (higherNumber) {
      this.moveNumbers(oldPosition, higherNumber);
    }
  };

  Game.prototype.getHigherNumber = function (numberPosition) {
    var newHeightX = numberPosition[0];
    var newHeightY1 = numberPosition[1] - Math.floor(this.numbersHeight);
    var newHeightY2 = newHeightY1 - 1;
    return this.numbers[[newHeightX, newHeightY1]] || this.numbers[[newHeightX, newHeightY2]];
  };
})();
