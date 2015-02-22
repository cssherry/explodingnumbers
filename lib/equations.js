(function(){
  if (typeof ExplodingNumbers === "undefined") {
    window.ExplodingNumbers = {};
  }

  // The difficulty will be passed into each new equation
  var Equation = ExplodingNumbers.Equation = function(difficulty, game){
    this.difficulty = difficulty;
    this.largestNumber = Math.pow(10, this.difficulty);
    this.operations = ['+', '-', '*', '/'];
  };

  // The main function, called when a new equation is needed
  Equation.prototype.createEquation = function(hashOfNumbers) {
    var operationIndex = ExplodingNumbers.Util.randomNumber(3);
    var operation = this.operations[operationIndex];

    switch(operation) {
    case '+':
      this.getRandomAnswer();
      var addend1 = this.getRandomNumberString(this.answer),
          addend2 = this.answer - addend1;
      return ' + ';
    case "-":
      var minuend = ExplodingNumbers.Util.randomNumber() + 1,
          subtrahend = this.getOtherNumberInEquation(hashOfNumbers, minuend, operation);
      return ' - ';
    case '*':
      this.getRandomAnswer();
      do {
        var multiplicand = this.getRandomNumberString(),
            multiplier = this.answer / multiplicand;
      } while (multiplicand * multiplier !== this.answer);
      return multiplicand + ' * ' + multiplier;
    case '/':
      var dividend = ExplodingNumbers.Util.randomNumber() + 1,
          divisor = this.getOtherNumberInEquation(hashOfNumbers, dividend, operation);
      return ' / ';
    }
  };

  // For addition and multiplication problems, the answer will be dependent on difficulty
  // So get a random answer from numbers on the board first
  Equation.prototype.getRandomAnswer = function (hashOfNumbers) {
    do {
      this.answer = this.getRandomNumberString();
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
            response = this.getRandomNumberString();
            this.answer = total - response;
          } while (this.answer < 0);
        case "/":
          do {
            response = this.getRandomNumberString();
            this.answer = total / response;
          } while (this.answer * response !== total);
      }
    }
    while (!this.answerInNumbersHash(hashOfNumbers));

    return response;
  };

  // An equation to test whether the answer can be created
  // from answers on the board
  Equation.prototype.answerInNumbersHash = function (hashOfNumbers) {
    var included = true;
    for (var i = 0; i < this.answer.length; i++) {
      if (!hashOfNumbers[this.answer[i]]) {
        included = false;
      }
    }
    return included;
  };

  // Get a random number, convert it to a string
  // If a maximum number is not specified, use the largestNumber based on the difficulty
  Equation.prototype.getRandomNumberString = function (maximumNumber) {
    maximumNumber = maximumNumber ? maximumNumber : this.largestNumber;
    var randomNumber = ExplodingNumbers.Util.randomNumber(maximumNumber);
    return randomNumber.toString();
  };
})();
