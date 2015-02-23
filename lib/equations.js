(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // The difficulty will be passed into each new equation
  var Equation = ExplodingNumbers.Equation = function(difficulty, pos){
    this.difficulty = Math.round(difficulty);
    this.pos = pos;
    this.largestNumber = Math.pow(10, this.difficulty);
    this.operations = ['+', '-', '*', '/'];
  };

  // The main function, called when a new equation is needed
  Equation.prototype.createEquation = function(hashOfNumbers) {
    // var operationIndex = ExplodingNumbers.Util.randomNumber(3);
    // var operation = this.operations[operationIndex];
    var operation = "/";

    switch(operation) {
    case '+':
      this.getRandomAnswer(hashOfNumbers);
      var addend1 = this.getRandomNumber(this.answer),
          addend2 = this.answer - addend1;
      this.equation = addend1 + ' + '  + addend2;
      break;
    case "-":
      var minuend = parseInt(this.getRandomNumber()) + 1,
          subtrahend = this.getOtherNumberInEquation(hashOfNumbers, minuend, operation);
      this.equation = minuend + ' - ' + subtrahend;
      break;
    case '*':
      this.getRandomAnswer(hashOfNumbers);
      var multiplicand = this.getRandomNumber(),
          multiplier = this.answer / multiplicand;
      while (multiplicand * multiplier !== this.answer){
        multiplicand = this.getRandomNumber();
        multiplier = this.answer / multiplicand;
      }
      this.equation = multiplicand + ' * ' + multiplier;
      break;
    case '/':
      var dividend = parseInt(this.getRandomNumber()) + 1,
          divisor = this.getOtherNumberInEquation(hashOfNumbers, dividend, operation);
      this.equation = dividend + ' / ' + divisor;
      break;
    }

    return this.equation;
  };

  // For addition and multiplication problems, the answer will be dependent on difficulty
  // So get a random answer from numbers on the board first
  Equation.prototype.getRandomAnswer = function (hashOfNumbers) {
    do {
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
    for (var i = 0; i < answerString.length; i++) {
      if (!hashOfNumbers[parseInt(answerString[i])]) {
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

  // Draw equation at top of canvas
  Equation.prototype.draw = function (ctx) {
    ctx.fillStyle = "black";
    ctx.fillText(this.equation, this.pos[0], this.pos[1]);
  };
})();
