
const domUpdates = {

  getPlayerNames() {
    let players = [];
    players.push(this.getPlayerOne());
    players.push(this.getPlayerTwo());
    players.push(this.getPlayerThree());
    return players;
  },

  getPlayerOne() {
    if ($('.player1-name').val()) {
      var playerOne = $('.player1-name').val();
    } else {
      var playerOne = 'Player 1';
    }
    return playerOne;
  },
  
  getPlayerTwo() {
    if ($('.player2-name').val()) {
      var playerTwo = $('.player2-name').val();
    } else {
      var playerTwo = 'Player 2';
    }
    return playerTwo;
  },
  
  getPlayerThree() {
    if ($('.player3-name').val()) {
      var playerThree = $('.player3-name').val();
    } else {
      var playerThree = 'Player 3';
    }
    return playerThree;
  },

  clearInputs() {
    $('.player1-name').val('');
    $('.player2-name').val('');
    $('.player3-name').val('');
  },

  goToGameScreen() {
    $('.home-screen').css('display', 'none');
    $('.popup-cover').css('display', 'none');
  },

  displayNames(playerArray, index) {
    $('.player-1-name').text(playerArray[0].name);
    $('.player-1-score').text(playerArray[0].wallet);
    $('.player1-ba').text(playerArray[0].name);
    $('.player1-ba-num').text(playerArray[0].bankAcct);

    $('.player-2-name').text(playerArray[1].name);
    $('.player-2-score').text(playerArray[1].wallet);
    $('.player2-ba').text(playerArray[1].name);
    $('.player2-ba-num').text(playerArray[1].bankAcct);

    $('.player-3-name').text(playerArray[2].name);
    $('.player-3-score').text(playerArray[2].wallet);
    $('.player3-ba').text(playerArray[2].name);
    $('.player3-ba-num').text(playerArray[2].bankAcct);

  },

  displayWinner(winner, score) {
    $('.game-winner').text(`${winner} WINS!!`);
    $('.winning-score').text(score);
  },

  goToHomeScreen() {
    $('.home-screen').css('display', 'flex');
    $('.popup-cover').css('display', 'unset');
  },

  displayWheel() {
    $('.popup-cover').css('display', 'unset');
    $('.wheel').toggleClass('slide-in');
  },

  spinWheel() {
    $('.vowel-error').css('display', 'none');
    $('.wheel-circle').toggleClass('wheel-spin');
  },

  hideWheel() {
    $('.popup-cover').css('display', 'none');
    $('.wheel').toggleClass('slide-in');
    $('.wheel-circle').toggleClass('wheel-spin');
  },

  populatePuzzleSquares(puzzle) {
    let letterBoxArray = Array.from($('.letter-content'));
    //let revealSound = new Audio('./audio/reveal.mp3');
    //revealSound.play();
    puzzle.forEach((letter, i) => {
      if (letter === '-' || letter === '&' || letter === '\'') {
        $(letterBoxArray[i]).text(letter);
        $(letterBoxArray[i]).parent().css('background', 'white');
      } else if (letter !== ' ') {
        $(letterBoxArray[i]).text(letter);
        $(letterBoxArray[i]).css('opacity', 0);
        $(letterBoxArray[i]).parent().css('background', 'white');
      } else if (letter === ' ') {
        $(letterBoxArray[i]).text(' ');
        $(letterBoxArray[i]).parent().css('background', '#1c7455')
      }
    });
  },

  showBonusLetters(length) {
    let letterBoxArray = Array.from($('.letter-content'));
    for (let i = 0; i < 7; i++) {
      let rand = Math.floor(Math.random() * length);
      $(letterBoxArray[rand]).css('opacity', 1);
    }
  },

  newRoundKeyboard() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if ($(letter).hasClass('disabled')) {
        $(letter).removeClass('disabled');
      } else if ($(letter).hasClass('vowel-disabled')) {
        $(letter).removeClass('vowel-disabled');
      }
    });
    this.resetVowels();
  },

  resetPuzzleSquares() {
    let letterBoxArray = Array.from($('.letter-content'));
    letterBoxArray.forEach(box => {
      $(box).text('');
      $(box).parent().css('background', '#1c7455')
    })
  },

  disableGuessedLetter(event) {
    if ($(event.target).hasClass('keyboard-letters')) {
      $(event.target).addClass('disabled')
    }
  },

  showLetter(character, isEnabled) {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    
    keyboardLetters.forEach(letter => {
      let letterText = $(letter).text();
      if (letterText.toUpperCase() === character) {
        if(isEnabled) {
          $(letter).removeClass('disabled');
        } else {
          $(letter).addClass('disabled');
        }
      }
    });
  },

  revealCorrectLetters(box) {
    $(box).css('opacity', 1);
  },

  resetVowels() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if ($(letter).hasClass('vowel')) {
        $(letter).removeClass('vowel-disabled');
        $(letter).removeClass('active-vowel');
        $(letter).addClass('temp-disabled');
      }
    });
  },

  resetKeyboard() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if (!['A', 'E', 'I', 'O', 'U'].includes($(letter).text())) {
        $(letter).removeClass('vowel');
      }
    });
  },

  newPlayerTurn(array, index) {
    let players = Array.from($('.player-info'));
    players.forEach((player, i) => {
      if (i === index) {
        $(player).addClass('current-player');
      } else {
        $(player).removeClass('current-player');
      }
    });
  },

  highlightVowels() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if ($(letter).hasClass('vowel') &&
       /*!$(letter).hasClass('temp-disabled') &&*/ !$(letter).hasClass('vowel-disabled')) {
        $(letter).addClass('active-vowel');
      } else {
        if (!$(letter).hasClass('disabled')) {
          $(letter).addClass('temp-disabled');
          $(letter).removeClass('active-vowel');
        }
      }
    });
  },

  disableGuessedVowel(event) {
    if ($(event.target).hasClass('vowel')) {
      $(event.target).addClass('vowel-disabled');
      $(event.target).addClass('temp-disabled');
      $(event.target).removeClass('active-vowel');
    }
  },

  updateCurrentSpin() {
    var spin = $('.spin-number').val()
    var dollarValue = parseInt(spin)
    return dollarValue;
  },

  setCurrentSpin(value) {
    var element = $('.spin-number');
    element.val(value);
  },

  yellCurrentSpin(value) {
    if (value) {
      $('.yell-box').text(value);
    }
    $('.yell-box').toggleClass('yell-active');
  },

  updateCategory(puzzle) {
    $('.hint-value').text(puzzle.category)
  },

  displayWheelValues(wheel) {
    for (var i = 0; i < 6; i++) {
      $(`.mark${i + 1}`).text(wheel.spinValues[i])
    }
  },

  enableLetters() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if ($(letter).hasClass('temp-disabled')) {
        $(letter).toggleClass('temp-disabled');
      }
      /*if ($(letter).hasClass('vowel')) {
        $(letter).addClass('temp-disabled');
        $(letter).removeClass('active-vowel');
      }*/

    });
  },

  tempDisableVowels() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if ($(letter).hasClass('vowel')) {
        $(letter).addClass('temp-disabled');
        $(letter).removeClass('active-vowel');
      }
    })
  },

  disableKeyboard() {
    let keyboardLetters = Array.from($('.keyboard-letters'));
    keyboardLetters.forEach(letter => {
      if (!$(letter).hasClass('vowel')) {
        $(letter).toggleClass('temp-disabled');
      } else {
        $(letter).removeClass('active-vowel');
      }
    })
  },

  displaySolvePopup(solution) {
    $('.solution').text(solution);
    $('.solve-popup').css('display', 'flex');
    $('.solve-input').focus();
  },

  hideSolvePopup() {
    $('.solve-popup').css('display', 'none');
  },

  displayBonusIntro(winner, score) {
    $('.popup-cover').css('display', 'unset');
    $('.bonus-round-intro').css('display', 'flex');
    $('.name-of-bonus-player').text(winner);
    $('.winner-money-pre-bonus').text(score);
  },

  startBonusRound() {
    $('.popup-cover').css('display', 'none');
    $('.bonus-round-intro').css('display', 'none');
    $('header').html(
      `<h1 class="bonus-round-header">BONUS RoUND</h1>
      <h2 class="bonus-instructions">Choose 1 vowel and 3 consonants</h2>`)
    $('header').css('display', 'block');
    $('.bank-accts').css('bottom', '35px');
  },

  resetGameDisplay() {
    $('.spin-number').text('--');
    $('.bonus-round-intro').css('display', 'none');
    $('.popup-cover').css('display', 'none');
    $('header').css('display', 'unset');
    $('header').html(
      `<header>
        <div class="on-deck">
          <h2 class="on-deck-name">player 2</h2>
          <h2 class="on-deck-score">0</h2>
        </div>
        <div class="at-bat">
          <h2 class="game-winner">player 1</h2>
          <h2 class="winning-score">0</h2>
          <button class="spin-button top-buttons">SPIN</button>
          <button class="solve-button top-buttons">SOLVE</button>
          <button class="vowel-button top-buttons">VOWEL</button>
          <button class="lose-a-turn-button top-buttons">LOSE A TURN</button>
          <button class="bankrupt-button top-buttons">BANKRUPT</button>
        </div>
        <div class="in-the-hole">
          <h2 class="in-the-hole-name">player 3</h2>
          <h2 class="in-the-hole-score">0</h2>
        </div>
      </header>`);
  },

  resetOnQuit() {
    $('.vowel-error').css('display', 'none');
    $('.solve-popup').css('display', 'none');
    $('.solve-input').val('');
    $('.spin-number').text('--');
    $('.home-screen').css('display', 'flex');
    $('.popup-cover').css('display', 'unset');

  }

}

export default domUpdates;