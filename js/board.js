import { get, newPlayerTurn, populatePuzzleSquares, revealLetters, updateNames, updateCurrentSpin, endRoundBoard } from "./client.js";


let game;

function updateGameState() {
    game = get("/game");
    populatePuzzleSquares(game.lastPuzzle);
    newPlayerTurn(game);
    revealLetters(game);
    updateNames(game);
    updateCurrentSpin(game);
    endRoundBoard(game.players);
}

updateGameState();