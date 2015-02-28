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
    this.bottomRow = {}; // columns and their fabricObject items, initially as fabric groups, but that was too difficult
    this.fallingNumbers = []; // for making sure falling numbers don't intersect, fabricObjects
    this.addInitialNumbers(); // populates this.fixedNumbersTopLayer array
    this.playersAnswer = []; //stores player's answers
    this.addFallingNumberTries = 0; // detect when numbers are having trouble falling

    this.equation = this.generateNewEquation();
  };

  // Create an initial row of numbers
  Game.prototype.addInitialNumbers = function(){
    for (var i = 0; i < this.numColumns; i++) {
      var xPosition = Math.floor((i * this.numbersHeight));
      var number = new ExplodingNumbers.Number([xPosition, this.bottomYPosition], this.numbersHeight, this.difficulty);

      this.bottomRow[xPosition] = [number.fabricObject];
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

    this.fallingNumbers.push(this.newNumber.fabricObject);
    this.numbersOnScreen[this.newNumber.content] = this.numbersOnScreen[this.newNumber.content] + 1 || 1;
    return this.newNumber;
  };

  // Returns true if there are any numbers in surrounding area
  Game.prototype.collidesWithOtherNumber = function (pos, currentFallingPosition) {
    this.newNumber = new ExplodingNumbers.Number(pos, this.numbersHeight, this.difficulty);
    if (this.findBottomColumn(pos)) {
      return true;
    }

    for (var j = 0; j < this.fallingNumbers.length; j++) {
      // skip current number if it's specified
      if (j !== currentFallingPosition) {
        if (this.newNumber.fabricObject.intersectsWithObject(this.fallingNumbers[j])) {
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
      var newPosition = [number.left, number.top + number.vel];
      var bottomRowColumn = this.findBottomColumn(newPosition);

      if (bottomRowColumn) {
        this.fallingNumbers.splice(j, 1);
        if (this.bottomRow[number.left]) {
          this.bottomRow[number.left].push(number);
        } else {
          this.bottomRow[number.left] = [number];
        }
      } else if (!this.collidesWithOtherNumber(newPosition, j)) {
        number.set({ top: number.top + number.vel });
      }
    }
  };

  // Easter Egg for the end
  Game.prototype.moveObjectsEnd = function() {
    for (var j = 0; j < this.fallingNumbers.length; j++) {
      var number = this.fallingNumbers[j];
      var newPosition = [number.left, number.top + number.vel];
      number.set({ top: number.top + number.vel });
    }
  };

  // Easter Egg for the end
  Game.prototype.addFallingNumbersEnd = function(){
    var randomX = Math.floor(ExplodingNumbers.Util.randomNumber(this.numColumns - 1) * this.numbersHeight); // have to shift by 4 so doesn't intersect with nearby number
    this.newNumber = new ExplodingNumbers.Number([randomX, 0], this.numbersHeight, this.difficulty);
    this.fallingNumbers.push(this.newNumber.fabricObject);
    return this.newNumber;
  };

  // returns true if the falling number has reached bottom row
  Game.prototype.findBottomColumn = function (pos) {
    // For some reason, if fabric objects are grid-aligned, neighboring objects will throw true to intersectsWithObject
    var testNumber = new ExplodingNumbers.Number([pos[0] + 4, pos[1]], this.numbersHeight - 4, this.difficulty);

    var currentColumn = this.bottomRow[pos[0]];
    var numberOfItems = currentColumn.length;

    if (this.bottomYPosition - (numberOfItems * this.numbersHeight) < pos[1]) { // third test when there's an empty column or column > 2 item
      return currentColumn;
    }

    return false;
  };

  // Add or remove clicked number to/from answer array
  Game.prototype.registerClickedNumber = function (clickedNumber) {
    if (clickedNumber !== this.backgroundFabric) { //make sure not clicking on background
      var answerIndex = this.playersAnswer.indexOf(clickedNumber);

      if ( answerIndex !== -1) { //Unselect number
        clickedNumber.item(0).set({fill: clickedNumber.oldColor});
        this.playersAnswer.splice(answerIndex, 1);
        clickedNumber.item(1).set({fill: 'black'});
      } else { // Select number
        clickedNumber.oldColor = clickedNumber.item(0).fill;
        clickedNumber.item(0).set({fill: '#343434'});
        this.playersAnswer.push(clickedNumber);
        clickedNumber.item(1).set({fill: 'white'});
      }

      return this.correctAnswer();
    }
  };

  // Check to see if an answer is right, if it is, increase difficulty by 0.1
  Game.prototype.correctAnswer = function() {
    var answerString = "";
    this.playersAnswer.forEach(function (number) {
      answerString += number.item(1).text;
    });

    if (parseInt(answerString) === parseInt(this.equation.answer)) {
      this.removeNumbersFromScreen();
      if (this.bottomRowEmpty()) {
        return "You Win!";
      } else {
        this.equation = this.generateNewEquation();
        this.difficulty += 0.1;
      }
    }
  };

  // Test to see if bottom row is empty
  Game.prototype.bottomRowEmpty = function () {
    for (var xPosition in this.bottomRow) {
      if (this.bottomRow[xPosition].length !== 0) {
        return false;
      }
    }
    return true;
  };

  // Just so I don't have to retype complicated equation
  Game.prototype.generateNewEquation = function () {
    return new ExplodingNumbers.Equation(this.difficulty, this.numbersOnScreen, this.DIM_X / 2 - 100);
  };

  // Remove clicked answers from the screen
  Game.prototype.removeNumbersFromScreen = function() {
    this.playersAnswer.forEach(function (number) {
      // Delete the number from hash of numbers on the screen if 1, otherwise, subtract 1
      if (this.numbersOnScreen[number.item(1).text] === 1) {
        delete this.numbersOnScreen[number.item(1).text];
      } else {
        this.numbersOnScreen[number.item(1).text] = this.numbersOnScreen[number.item(1).text] - 1;
      }

      // Delete the number from either the hash of numbers or falling numbers
      var fallingNumberIndex = this.fallingNumbers.indexOf(number);

      if (fallingNumberIndex !== -1) {
        this.fallingNumbers.splice(fallingNumberIndex, 1);
      } else {
        this.moveNumbersDown(number.left, number);
      }
    }.bind(this));
    this.playersAnswer = [];
  };

  // Move numbers above clicked answers down or simply delete number
  Game.prototype.moveNumbersDown = function (xPosition, number) {
    var column = this.bottomRow[xPosition],
        deletedNumberIndex = column.indexOf(number);
    column.splice(deletedNumberIndex, 1);

    for (var i = 0; i < column.length; i++) {
      column[i].set({top: this.bottomYPosition - (this.numbersHeight * i)});
    }
  };
})();
