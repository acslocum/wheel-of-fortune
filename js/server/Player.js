//const domUpdates = require('./DOM.js');

class Player {
  constructor(index) {
    this.index = index;
    this.wallet = 0;
    this.bankAcct = 0;
    this.name = `Player ${index}`
  }

  guessCorrectLetter(numCorrect, wheelValue) {
        this.wallet += numCorrect * wheelValue;
        //domUpdates.updateWallet(this);
        //domUpdates.disableKeyboard();
    }

  buyVowel() {
        this.wallet -= 100;
        //domUpdates.highlightVowels();
        //domUpdates.updateWallet(this);
    }
}


module.exports = Player;