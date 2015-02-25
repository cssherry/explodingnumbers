(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  var Game = ExplodingNumbers.Game = function(dimX, dimY, numColumns){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.numColumns = numColumns;
    this.difficulty = 1;

    this.backgroundFabric = new fabric.Rect({ fill: "black", width: dimX, height: dimY , top: 0, left: 0, selectable: false });

    this.numbersHeight = Math.floor(this.DIM_X / this.numColumns) ; // height and width of each number
    this.screenOffsetY = (20 + this.numbersHeight); //Give canvas room for equation on top
    this.bottomYPosition = Math.floor(this.DIM_Y - this.numbersHeight - 2); //Define this here to be used when making initial row and assigning floor numbers

    this.numbersOnScreen = {}; // hash of numbers on the screen
    this.bottomRow = []; // columns as Fabric groups
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
      var number = new ExplodingNumbers.Number([0, 0], this.numbersHeight, this.difficulty);
      var row = new fabric.Group([ number.fabricObject ], { left: xPosition,
                                                            top: this.bottomYPosition,
                                                            selectable: false});

      this.bottomRow.push(row);
      this.numbersOnScreen[number.content] = this.numbersOnScreen[number.content] + 1 || 1;
    }
  };

  // Randomly add falling numbers to the top of the page
  Game.prototype.addFallingNumbers = function(){
    var randomX = null;
    this.addFallingNumberTries = 0;
    do {
      if(this.addFallingNumberTries > 30) throw "screenIsFull"; // Throw error ending game if all the positions are full
      randomX = Math.floor(ExplodingNumbers.Util.randomNumber(this.numColumns - 1) * this.numbersHeight);
      this.addFallingNumberTries++;
    } while (this.collidesWithOtherNumber([randomX, Math.floor(this.screenOffsetY)]));

    this.fallingNumbers.push(this.newNumber);
    this.numbersOnScreen[this.newNumber.content] = this.numbersOnScreen[this.newNumber.content] + 1 || 1;
    return this.newNumber;
  };

  // Returns true if there are any numbers in surrounding area
  Game.prototype.collidesWithOtherNumber = function (pos) {
    this.newNumber = new ExplodingNumbers.Number(pos, this.numbersHeight, this.difficulty);

    for (var i = 0; i < this.bottomRow.length; i++) {
      if (this.newNumber.fabricObject.intersectsWithObject(this.bottomRow[i])) {
        return true;
      }
    }

    for (var j = 0; j < this.fallingNumbers.length; j++) {
      if (this.newNumber.fabricObject.intersectsWithObject(this.fallingNumbers[j].fabricObject)) {
        return true;
      }
    }

    return false;
  };

  // Move all falling numbers if nothing is blocking it's way
  Game.prototype.moveObjects = function() {
    for (var j = 0; j < this.fallingNumbers.length; j++) {
      var number = this.fallingNumbers[j];
      var newPosition = [number.pos[0], number.pos[1] + number.vel];
      var bottomRowItem = this.findBottomRow(newPosition);

      if (bottomRowItem) {
        this.fallingNumbers.splice(j, 1);
        this.addNewRow(bottomRowItem, number);
      } else if (!this.collidesWithOtherNumber(newPosition)) {
        number.moveDown();
      }
    }
  };

  // returns true if the falling number has reached bottom row
  Game.prototype.findBottomRow = function (pos) {
    var testNumber = new ExplodingNumbers.Number(pos, this.numbersHeight, this.difficulty);

    for (var i = 0; i < this.bottomRow.length; i++) {
      if (testNumber.fabricObject.intersectsWithObject(this.bottomRow[i]) || this.bottomYPosition < pos[1]) {
        return this.bottomRow[i];
      }
    }
    return false;
  };

  // adds new item to column group
  Game.prototype.addNewRow = function (column, newItem) {
    var items = column.getObjects();
    var numberRows = items.length;

    for (var i = 0; i < items.length; i++) {
      items[i].set({top: (numberRows - i) * this.numbersHeight});
    }
    newItem.set({ top: 0 });
    column.add(newItem);
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
