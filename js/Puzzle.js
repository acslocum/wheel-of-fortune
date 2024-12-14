import domUpdates from './DOM.js';

class Puzzle {
  constructor(currentPuzzle) {
    this.currentPuzzle = currentPuzzle;
    this.puzzleLength = this.countCharacters(this.currentPuzzle.correct_answer);
    this.correctCount = 0;
    this.numberCorrect = 0;
    this.completed = false;
  }

  countCharacters(aPhrase) {
    var regex = /[a-zA-Z0-9]/g; 
    return aPhrase.match(regex).length;
  }
  
  populateBoard() {
    let puzzleArray = this.currentPuzzle.correct_answer.split('');
    domUpdates.populatePuzzleSquares(puzzleArray);
  }

  populateBonus(puzzleLength) {
    let puzzleArray = this.currentPuzzle.correct_answer.split('');
    domUpdates.populatePuzzleSquares(puzzleArray);
    domUpdates.showBonusLetters(puzzleLength);
  }

  checkIfConsonantEnabled(e) {
    if ($(e.target).hasClass('disabled') ||
      $(e.target).hasClass('temp-disabled') ||
      $(e.target).hasClass('keyboard-section')) {
      return false;
    } else {
      domUpdates.disableGuessedLetter(e);
      return true;
    }
  }

  checkGuess(guess) {
    if (this.currentPuzzle.correct_answer.toUpperCase().includes(guess)) {
      return true;
    }
    return false;
  }

  checkIfVowelAvailable(vowel, e) {
    if ($(e.target).hasClass('active-vowel')) {
      domUpdates.disableGuessedVowel(e);
      this.countCorrectLetters(vowel);
    }
  }

  countCorrectLetters(guess) {
    let numLetters = 0;
    let letterBoxArray = Array.from($('.letter-content'));
    letterBoxArray.forEach(box => {
      if ($(box).text().toUpperCase() === guess) {
        numLetters++;
        this.correctCount++;
        domUpdates.revealCorrectLetters(box);
      }
    });
    this.numberCorrect = numLetters;
    this.checkCompletion();
  }

  checkCompletion() {
    if (this.correctCount === this.puzzleLength) {
      this.completed = true;
    }
  }

  solvePuzzle(guess) {
    if (this.equalsIgnoreCase(guess,this.currentPuzzle.correct_answer)) {
      domUpdates.hideSolvePopup();
      domUpdates.yellCurrentSpin('CORRECT');
      setTimeout(domUpdates.yellCurrentSpin, 2000);
      this.completed = true;
      let letterBoxArray = Array.from($('.letter-content'));
      letterBoxArray.forEach(box => domUpdates.revealCorrectLetters(box));
      return true;
    } else {
      domUpdates.hideSolvePopup();
      domUpdates.yellCurrentSpin('INCORRECT');
      setTimeout(domUpdates.yellCurrentSpin, 2000);
      return false;
    }
  }

  equalsIgnoreCase(a, b) {
    if(a === null || b === null) return false;
    return a.toUpperCase() === b.toUpperCase();
  }

  correctAnswer() {
    return this.currentPuzzle.correct_answer;
  }
}

export default Puzzle;