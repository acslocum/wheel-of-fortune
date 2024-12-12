import domUpdates from './DOM.js';
import Puzzle from './Puzzle.js';

let buzzer = new Audio('./audio/Buzzer.mp3');
let chooseSound = new Audio('./audio/choose.mp3');
let ding = new Audio('./audio/Ding.mp3');
let theme = new Audio('./audio/theme.mp3');
let solveSound = new Audio('./audio/solve.mp3');
let spinSound = new Audio('./audio/spin.mp3');
let bankrupt = new Audio('./audio/bankr.mp3');

let game;
let round;
let puzzle;
//let wheel;

$('.start-button').on('click', init);
$('.quit').on('click', quitHandler);
$('.spin-button').on('click', spinHandler);
$('.solve-button').on('click', domUpdates.displaySolvePopup);
$('.solve-input-button').on('click', solveHandler);
$('.spin-text').on('click', spinHandler);
$('.vowel-button').on('click', vowelPurchaseHandler);
$('.start-bonus-round').on('click', startBonusHandler);
$('.bonus-round-intro').on('click', newGameHandler);
$('.keyboard-section').on('click', keyboardHandler);
$('header').on('click', () => {
  theme.volume = 0.7;
});

function playLoopingAudio(audioObject)  {
  audioObject.play();
  audioObject.addEventListener('ended', () => {
    audioObject.play();
  });
}

function init() {
  resetPlayers();
  var names = domUpdates.getPlayerNames();
  newRoundHandler(names);
  setTimeout(() => {
    playLoopingAudio(theme);
  }, 1000);
}

function get(url, data=null) {
  let responseData;
  $.ajax({
    url: url,
    async: false,
    data: data,
    success: function(response) {
      responseData = response;
    }
  });
  return responseData;
}

function resetPlayers() {
  $.post('/resetPlayers');
}

function newRoundHandler(names) {
  let data;
  if(names !== undefined)
    data = {'player1': names[0], 'player2': names[1], 'player3': names[2]};
  game = get('/newRound', data);
  updateNames(game);
  puzzle = new Puzzle(game.lastPuzzle);
  //wheel = round.generateWheelValue();
  setUpRound();
}

function updateNames(game) {
  domUpdates.displayNames(game.players, game.playerIndex);
}

function setUpRound() {
  domUpdates.resetPuzzleSquares();
  puzzle.populateBoard();
  domUpdates.updateCategory(puzzle);
  domUpdates.newRoundKeyboard();
  domUpdates.clearInputs();
  domUpdates.goToGameScreen();
  domUpdates.enableLetters();
  //domUpdates.displayWheel();
}

function quitHandler() {
  domUpdates.resetOnQuit();
  get('/reset');
}

function spinHandler() {
  var spinValue = domUpdates.updateCurrentSpin();
  domUpdates.enableLetters();
  game = get('/spin', { 'spinValue': spinValue });
}

function checkIfPuzzleSolved() {
  if (puzzle.completed) {
    endRound();
    domUpdates.yellCurrentSpin('CORRECT');
    chooseSound.pause();
    playLoopingAudio(theme);
    solveSound.play();
    setTimeout(domUpdates.yellCurrentSpin, 2000);
    setTimeout(newRoundHandler, 2500);
  }
}

function vowelPurchaseHandler() {
  if (game.players[game.playerIndex].wallet < 100) {
    return $('.vowel-error').css('display', 'unset');
  }
  domUpdates.highlightVowels();
}

function startBonusHandler() {
  domUpdates.startBonusRound();
  domUpdates.displayWheel();
  domUpdates.highlightVowels();
}

function newGameHandler(e) {
  if ($(e.target).hasClass('new-game')) {
    domUpdates.resetGameDisplay();
    get('/reset');
  }
}

function endRound() {
  game = get('/endRound');
  let winner = game.players[game.playerIndex];
  domUpdates.updateBankAccts(game.players);
  domUpdates.displayWinner(winner.name, winner.wallet);
}

function endRoundBoard() {
  game = get('/game');
  let winner = game.players[game.playerIndex];
  domUpdates.updateBankAccts(game.players);
  if(game.winner !== null) {
    domUpdates.displayWinner(winner.name, winner.wallet);
  }
}

function solveHandler() {
  let guess = $('.solve-input').val().toLowerCase();
  $('.solve-input').val('');
  let result = puzzle.solvePuzzle(guess);
  if (result) {
    endRound();
    chooseSound.pause();
    playLoopingAudio(theme);
    solveSound.play();
    setTimeout(newRoundHandler, 2500);
  } else {
    buzzer.play();
    game.endTurn();
  }
};

function solveBonusHandler(result) {
  if (result) {
    round.didWinBonus = true;
    round.postBonusResult();
  } else {
    round.didWinBonus = false;
    round.postBonusResult();
  }
}
/*
function spinHandler() {
  spinSound.play();
  domUpdates.spinWheel();
  setTimeout(() => {
    game.tearDownWheel(wheel, round);
    domUpdates.yellCurrentSpin(wheel.currentValue);
    setTimeout(domUpdates.yellCurrentSpin, 2000);
    badSpinHandler();
  }, 2000);
}
  */

function badSpinHandler() {
  if (wheel.currentValue === 'LOSE A TURN') {
    game.endTurn();
    buzz.play();
  } else if (wheel.currentValue === 'BANKRUPT') {
    bankrupt.play();
    game.players[game.playerIndex].wallet = 0;
    game.endTurn();
  } else {
    theme.pause()
    playLoopingAudio(chooseSound);
    chooseSound.volume = 0.8;
  }
}

function keyboardHandler(e) {
  chooseSound.volume = 0.7;
  $('.vowel-error').css('display', 'none');
  let currentTurn = game.players[game.playerIndex];
  let currentGuess = $(e.target).text();
  if (['A', 'E', 'I', 'O', 'U'].includes(currentGuess)) {
    vowelGuessHandler(currentGuess, currentTurn, e);
  } else {
    consonantGuessHandler(currentGuess, currentTurn, e);
  }
}

function vowelGuessHandler(currentGuess, currentTurn, e) {
  if (!$(e.target).hasClass('active-vowel')) {
    return;
  } else {
    guessActiveVowel(currentGuess, currentTurn, e); 
  }
}

function endTurn() {
  game = get('/endTurn');
  domUpdates.newPlayerTurn(game.players, game.playerIndex);
  domUpdates.disableKeyboard();
}

function guessActiveVowel(currentGuess, currentTurnPlayer, e) {
  game = get('/guessLetter',{ 'letter': currentGuess });
  console.log(game);
  let isGuessCorrect = puzzle.checkGuess(currentGuess);
  puzzle.checkIfVowelAvailable(currentGuess, e);
  updatePlayerWallet(currentTurnPlayer, -100, 1);
  if (isGuessCorrect) {
    checkIfPuzzleSolved();
    ding.play();
  } else {
    endTurn();
    domUpdates.disableKeyboard();
    buzzer.play();
  }
}

function updatePlayerWallet(player, wheelValue, numCorrect) {
  let data;
  $.ajax({
    url: '/updatePlayerWallet',
    type: "GET",
    async: false,
    data: { 'playerIndex': player.index, 'wheelValue' : wheelValue, 'numCorrect': numCorrect },
    success: function(response) {
      data = response;
    }
  });
  game = data;
  domUpdates.updateWallet(game.players[player.index]);
}

function consonantGuessHandler(currentGuess, currentTurnPlayer, e) {
  game = get('/guessLetter',{ 'letter': currentGuess });
  console.log(game);
  let isGuessCorrect = puzzle.checkGuess(currentGuess);
  let isEnabled = puzzle.checkIfConsonantEnabled(e);
  if (isEnabled && isGuessCorrect) {
    var wheelCurrentValue = domUpdates.updateCurrentSpin();
    puzzle.countCorrectLetters(currentGuess);
    updatePlayerWallet(currentTurnPlayer, wheelCurrentValue, puzzle.numberCorrect);
    checkIfPuzzleSolved();
    ding.play();
  } else if (isEnabled && !isGuessCorrect) {
    endTurn();
    buzzer.play();
  }
}

function revealLetters(game) {
  game.lettersGuessed.forEach((letter) => {
    puzzle.countCorrectLetters(letter);
  });
}

function newPlayerTurn(game) {
  domUpdates.newPlayerTurn(game.players, game.playerIndex);
}

function populatePuzzleSquares(lastPuzzle) {
  if(lastPuzzle === undefined || lastPuzzle.correct_answer === undefined) {
    return;
  }
  puzzle = new Puzzle(lastPuzzle);
  domUpdates.populatePuzzleSquares(lastPuzzle.correct_answer.split(''));
}

function updateCurrentSpin(game) {
  domUpdates.setCurrentSpin(game.currentSpin);
}

export {get, populatePuzzleSquares, newPlayerTurn, revealLetters, updateNames, updateCurrentSpin, endRoundBoard};