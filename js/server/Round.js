const data = require('./data.js');

class Round {
  constructor(puzzleBank) {
    this.puzzleBank = puzzleBank;
  }

  generatePuzzle() {
    let randomIndex = Math.floor(Math.random() * this.puzzleBank.length);
    return this.puzzleBank[randomIndex];
  }

 
}

module.exports = Round;
