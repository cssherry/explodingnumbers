(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // The difficulty will be passed into each new equation
  var Equation = ExplodingNumbers.Equation = function(difficulty, hashOfNumbers, xPosition){
    this.difficulty = Math.round(difficulty);
    this.largestNumber = Math.pow(10, this.difficulty);
    this.operations = ['+', '-', '*', '/'];
    this.equationGenerationTries = 0;

    this.xPosition = xPosition;

    this.createEquation(hashOfNumbers);
  };

  // The main function, called when a new equation is needed
  Equation.prototype.createEquation = function(hashOfNumbers) {
    var operationIndex = ExplodingNumbers.Util.randomNumber(3);
    var operation = this.operations[operationIndex];
    var equationText = "";

    try {
      switch(operation) {
      case '+':
        this.getRandomAnswer(hashOfNumbers);
        var addend1 = this.getRandomNumber(this.answer),
            addend2 = this.answer - addend1;
        equationText = addend1 + ' + '  + addend2;
        this.equation = this.generateEquationObject(equationText);
        break;
      case "-":
        var minuend = this.getRandomNumber() + 1,
            subtrahend = this.getOtherNumberInEquation(hashOfNumbers, minuend, operation);
        equationText = minuend + ' - ' + subtrahend;
        this.equation = this.generateEquationObject(equationText);
        break;
      case '*':
        this.getRandomAnswer(hashOfNumbers);
        var multiplicand = this.getRandomNumber(),
            multiplier = this.answer / multiplicand;

        // Only use integers!
        while (multiplicand * multiplier !== this.answer || !Number.isInteger(multiplier)){
          multiplicand = this.getRandomNumber();
          multiplier = this.answer / multiplicand;
        }

        equationText = multiplicand + ' x ' + multiplier;
        this.equation = this.generateEquationObject(equationText);
        break;
      case '/':
        var dividend = this.getRandomNumber() + 1,
            divisor = this.getOtherNumberInEquation(hashOfNumbers, dividend, operation);
        equationText = dividend + ' / ' + divisor;
        this.equation = this.generateEquationObject(equationText);
        break;
      }
    }

    // Catch instances when there is no equation with answers on the screen for given starting number
    catch(error){
      this.equationGenerationTries = 0;
      this.createEquation(hashOfNumbers);
    }

    return this.equation;
  };

  // Make equation into a fabric object
  Equation.prototype.generateEquationObject = function (text) {
    return new fabric.Text("What is " + text + "?", {
      fontSize: 20,
      fill: 'white',
      top: 0,
      left: this.xPosition,
    });
  };

  // For addition and multiplication problems, the answer will be dependent on difficulty
  // So get a random answer from numbers on the board first
  Equation.prototype.getRandomAnswer = function (hashOfNumbers) {
    do {
      if(this.equationGenerationTries > 20) throw "infiniteloop"; //Recognize infinite loops and make createEquation start again
      this.equationGenerationTries++;
      this.answer = this.getRandomNumber();
    }
    while (!this.answerInNumbersHash(hashOfNumbers));

    return this.answer;
  };

  // for subtraction and division problem, a random number is generated for number left of operator
  // The other number will be randomly generated so that the answer is in the numbersHash
  Equation.prototype.getOtherNumberInEquation = function (hashOfNumbers, total, operation) {
    var response = null;
    do {
      if(this.equationGenerationTries > 20) throw "infiniteloop";
      this.equationGenerationTries++;
      switch(operation) {
        case "-":
          do {
            response = this.getRandomNumber();
            this.answer = total - response;
          } while (this.answer < 0);
          break;
        case "/":
          do {
            response = this.getRandomNumber();
            this.answer = Math.round(total / response);
          } while (this.answer * response !== total);
          break;
      }
    }
    while (!this.answerInNumbersHash(hashOfNumbers));

    return response;
  };


  // An equation to test whether the answer can be created
  // from answers on the board
  Equation.prototype.answerInNumbersHash = function (hashOfNumbers) {
    var included = true;
    var answerString = this.answer.toString();
    var answerHash = {};
    for (var i = 0; i < answerString.length; i++) {
      answerHash[parseInt(answerString[i])] = answerHash[parseInt(answerString[i])] + 1 || 1;
    }

    for (var number in answerHash) {
      if (!hashOfNumbers[number] || answerHash[number] > hashOfNumbers[number]) {
        included = false;
      }
    }
    return included;
  };

  // Get a random number, convert it to a string
  // If a maximum number is not specified, use the largestNumber based on the difficulty
  Equation.prototype.getRandomNumber = function (maximumNumber) {
    maximumNumber = maximumNumber ? maximumNumber : this.largestNumber;
    return ExplodingNumbers.Util.randomNumber(maximumNumber);
  };
})();
