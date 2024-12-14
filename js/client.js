import domUpdates from './DOM.js';
import Puzzle from './Puzzle.js';

let buzzer = new Audio('./audio/Buzzer.mp3');
let chooseSound = new Audio('./audio/choose.mp3');
let ding = new Audio('./audio/Ding.mp3');
let solveSound = new Audio('./audio/solve.mp3');
let spinSound = new Audio('./audio/spin.mp3');
let bankrupt = new Audio('./audio/bankr.mp3');

let game;
let round;
let puzzle;
//let wheel;
let VOWEL_COST = 250;

$('.start-button').on('click', init);
$('.quit').on('click', quitHandler);
$('.spin-button').on('click', spinHandler);
$('.solve-button').on('click', domUpdates.displaySolvePopup);
$('.solve-correct-button').on('click', solveCorrectHandler);
$('.solve-wrong-button').on('click', solveWrongHandler);
$('.spin-text').on('click', spinHandler);
$('.vowel-button').on('click', vowelPurchaseHandler);
$('.lose-a-turn-button').on('click', loseATurnHandler);
$('.bankrupt-button').on('click', bankruptHandler);
$('.new-puzzle-button').on('click', newRoundHandler);
$('.start-bonus-round').on('click', startBonusHandler);
$('.bonus-round-intro').on('click', newGameHandler);
$('.keyboard-section').on('click', keyboardHandler);


function init() {
  resetPlayers();
  var names = domUpdates.getPlayerNames();
  newRoundHandler(names);
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
  if(names !== undefined && names !== null) {
    data = {'player1': names[0], 'player2': names[1], 'player3': names[2]};
  }
  game = get('/newRound', data);
  updateNames(game);
  puzzle = new Puzzle(game.lastPuzzle);
  setUpRound();
}

function updateNames(game) {
  domUpdates.displayNames(game.players, game.playerIndex);
}

function updateCategory(puzzle) {
  domUpdates.updateCategory(puzzle);
}

function resetPuzzleSquares() {
  domUpdates.resetPuzzleSquares();
}

function setUpRound() {
  resetPuzzleSquares();
  puzzle.populateBoard();
  updateCategory(game.lastPuzzle);
  domUpdates.newRoundKeyboard();
  domUpdates.clearInputs();
  domUpdates.goToGameScreen();
  domUpdates.disableKeyboard();
  newPlayerTurn(game)
  //domUpdates.enableLetters();
}

function quitHandler() {
  domUpdates.resetOnQuit();
  get('/reset');
}

function spinHandler() {
  var spinValue = domUpdates.updateCurrentSpin();
  domUpdates.enableLetters();
  domUpdates.tempDisableVowels();
  game = get('/spin', { 'spinValue': spinValue });
}

function checkIfPuzzleSolved() {
  if (puzzle.completed) {
    endRound();
    domUpdates.yellCurrentSpin('CORRECT');
    chooseSound.pause();
    solveSound.play();
    setTimeout(domUpdates.yellCurrentSpin, 2000);
    setTimeout(newRoundHandler, 2500);
  }
}

function vowelPurchaseHandler() {
  if (game.players[game.playerIndex].wallet < VOWEL_COST) {
    return $('.vowel-error').css('display', 'unset');
  }
  domUpdates.highlightVowels();
}

function loseATurnHandler() {
  endTurn();
}

function bankruptHandler() {
  game = get('/bankrupt');
  bankrupt.play();
  domUpdates.displayNames(game.players, game.playerIndex);
  domUpdates.newPlayerTurn(game.players, game.playerIndex);
  domUpdates.disableKeyboard();
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
  updateNames(game);
  domUpdates.displayWinner(winner.name, winner.wallet);
}

function endRoundBoard() {
  game = get('/game');
  let winner = game.players[game.playerIndex];
  updateNames(game);
  if(game.winner !== null) {
    domUpdates.displayWinner(winner.name, winner.wallet);
  }
}

function solveHandler(guess) {
  domUpdates.hideSolvePopup();
  $('.solve-input').val('');
  let result = puzzle.solvePuzzle(guess);
  if (result) {
    endRound();
    chooseSound.pause();
    solveSound.play();
    //setTimeout(newRoundHandler, 2500);
  } else {
    buzzer.play();
    endTurn();
  }
};

function solveCorrectHandler() {
  solveHandler(puzzle.correctAnswer());
}

function solveWrongHandler() {
  solveHandler("wrong")
}

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
  updateNames(game);
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
  if(game.winner !== null) {//show full puzzle 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach((letter) => {
      puzzle.countCorrectLetters(letter);
    })
    return;
  }
  game.lettersGuessed.forEach((letter) => {
    puzzle.countCorrectLetters(letter);
  });
}

function enableLetters() {
  domUpdates.enableLetters();
  
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

function showGuessedLetters(game) {
  let notGuessed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').filter((letter) => {
    return !game.lettersGuessed.includes(letter);
  });
  notGuessed.forEach((letter) => {
    domUpdates.showLetter(letter.toUpperCase(),true);
  });
  game.lettersGuessed.forEach((letter) => {
    domUpdates.showLetter(letter.toUpperCase(),false);
  });
}

export {get, populatePuzzleSquares, newPlayerTurn, revealLetters, updateNames, updateCurrentSpin, endRoundBoard, updateCategory, enableLetters, resetPuzzleSquares, showGuessedLetters};
