const data = require('./data.js');
//const domUpdates = require('./DOM.js');
const Round = require('./Round.js');
const Player = require('./Player.js');
//const BonusRound = require('./BonusRound.js');

class Game {
  constructor() {
    this.round = 0;
    this.bonusRound = false;
    this.players = [];
    this.playerIndex = 0;
    this.puzzleKeys = Object.keys(data.puzzles);
    this.lastPuzzle= {};
    this.winner = null;
    this.lettersGuessed = [];
    this.currentSpin = 0
    this.resetPlayers();
  }

  resetPlayers() {
    this.players = [new Player(0), new Player(1), new Player(2)];
  }

  setNames(player1, player2, player3) {
    this.players[0].name = player1;
    this.players[1].name = player2;
    this.players[2].name = player3;
  }

  updatePlayerWallet(playerIndex, wheelValue, numCorrect) {
    if(wheelValue < 0) {
      this.players[playerIndex].buyVowel();
    } else {
      this.players[playerIndex].guessCorrectLetter(numCorrect, wheelValue);
    }

  }

  startRound() {
    this.round = this.round%4 + 1;
    //$('.round-num').text(this.round);
    let roundIndex = this.round - 1;
    let puzzleKeyIndex = this.puzzleKeys[roundIndex];
    // if (this.round === 6) {
    //   return;
    // } else if (this.round === 5) {
    //   this.bonusRound = true;
    //   $('.round-num').text('$');
    //   return new BonusRound(data.puzzles[bonusRoundPuzzles].puzzle_bank,
    //     data.bonusWheel);
    // } else {
    // console.log(data);
    // console.log(data.puzzles);
    // console.log(puzzleKeyIndex);
    // console.log(data.puzzles[puzzleKeyIndex]);
     let round = new Round(data.puzzles.puzzle_bank);
      this.lastPuzzle = round.generatePuzzle();
      this.lettersGuessed = [];
      this.winner = null;
 //   }
  }

  bankrupt() {
    this.players[this.playerIndex].wallet = 0;
    this.endTurn();
  }

  endTurn() {
    this.playerIndex === 2 ? this.playerIndex = 0 : this.playerIndex++;
  }

  endRound() {
    let winner = this.players[this.playerIndex];
    winner.bankAcct += winner.wallet;
    this.winner = this.playerIndex;
    //domUpdates.updateBankAccts(winner, this.playerIndex);
    //domUpdates.displayWinner(winner.name, winner.wallet);
    this.players.forEach(player => {
      player.wallet = 0;
    });
  }

  endGame() {
    let winner = this.players.sort((a, b) => {
      return b.bankAcct - a.bankAcct;
    })[0];
    let winningScore = winner.bankAcct;
    //domUpdates.displayBonusIntro(winner.name, winningScore);
    return winner;
  }

  quitGame() {
    this.round = 0;
    this.bonusRound = false;
    //domUpdates.goToHomeScreen();
    //domUpdates.resetPuzzleSquares();
    //domUpdates.resetKeyboard();
    //domUpdates.clearBankAccts();
  }

  setUpWheel() {
    //domUpdates.enableLetters();
    //domUpdates.displayWheel();
  }

  tearDownWheel(wheel, round) {
    //domUpdates.hideWheel();
    wheel.grabSpinValue();
    if (this.bonusRound) {
      round.bonusWheelValue = wheel.currentValue;
    }
  }

  clickCounter(round) {
    if (round.keyBoardClickCount === 0) {
      //domUpdates.disableKeyboard();
      round.keyBoardClickCount++;
    } else if (round.keyBoardClickCount < 2) {
      //domUpdates.disableKeyboard();
      round.keyBoardClickCount++;
    } else {
      //domUpdates.displaySolvePopup();
    }
  }

}

module.exports = Game;
