# Exploding Numbers

[Website][website]

[website]: http://www.cssherry.com/explodingnumbers

## Minimum Viable Product
The game should be a tetris of numbers.

- [X] Numbers fall and there is an initial layer of numbers on floor
- [X] Game displays random arithmetic operations (+, -, /, and *) with answers that can be created from fallen numbers.
- [X] Fallen/falling numbers should be clickable. Difficulty increases with every successful click.
- [X] Difficulty is defined by quicker falling rate and larger numbers.

## Design Docs
### Classes
* [Util][util]
  * Defines inheritance and some equations common to the other classes (like random number generator and random color generator)
  * **Functions**: inherits
* [MovingObject][movingObject]
  * Holds main functionality of making the moving class (defining a fabric.js object, finding it's position, and moving it downward)
* [Numbers][numbers]
  * Inherits from Moving Objects. Originally intended to make transition to making a bomb class easier
* [Game][game]
  * Holds the logic for how to move an object down, how to check answers selected by the user, and when a game ends
* [Equation][equation]
  * Holds the logic for generating random equations
* [FallingScreen][falling-screen]
  * Holds instances of the game, equation, and has logic for starting the game.

  [falling-screen]: ./lib/fallingScreen.js
  [equation]: ./lib/equations.js
  [game]: ./lib/game.js
  [numbers]: ./lib/number.js
  [movingObject]: ./lib/movingObject.js
  [util]: ./lib/util.js


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
- Library such as [Fabric.js](http://fabricjs.com/fabric-intro-part-1/) for making Canvas items interactive (clickable).
### Canvas
