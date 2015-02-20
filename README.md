# Exploding Numbers

[Website][website]

[website]: http://www.cssherry.com/exploding_numbers

## Minimum Viable Product
The game should be a tetris of numbers.

- [ ] Numbers fall and there is an initial layer of numbers on floor
- [ ] Game displays random arithmetic operations (+, -, /, and *) with answers that can be created from fallen numbers.
- [ ] Fallen/falling numbers should be clickable. Difficulty increases with every successful click.
- [ ] Difficulty is defined by quicker falling rate and larger numbers.

## Design Docs
### Classes
* Util
  * Defines inheritance
  * **Functions**: inherits
* MovingObject
  * **Functions**: fall, isAtBottom, stopFall
* Numbers
  * Inherits from Moving Objects
  * **Functions**: setUpView, startGame, endGame
* Game
  * Holds the logic for what defines a step, when a game ends
  * **Functions**: run, createTurn, endTurn
* FallingScreen
  * Holds the falling numbers
  * **Functions**: makeScreen, isEmptyPos, addNumber, moveNumber
* Equation
  * Holds the logic for generating random equations
  * Functions: checkAnswer

## Implementation Timeline

### Phase 1: Create FallingScreen (~0.5 day)
Make the falling numbers and initial layer of numbers. Display this on the screen.

### Phase 2: Display Equations (~0.5 days)
Make random equations show up on page. These equations will differ depending on difficulty.

### Phase 3: Enable clicking of numbers (~0.5 day)
Use jQuery UI to make each number clickable, also register the number that is clicked.

### Bonus Features
- [ ] Random bombs to clear all instances of a random number.
- [ ] Point system based on difficulty and final score can be saved.
- [ ] Two modes, default mode ends game when numbers reach top of screen, timer method will return score at the end of 5 minutes.

## Technology used:
### JavaScript
- jQuery
  - jQuery UI
- AJAX
- YAML to save scores
### Canvas
