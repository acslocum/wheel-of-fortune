import { get, newPlayerTurn, populatePuzzleSquares, revealLetters, updateNames, updateCurrentSpin, endRoundBoard, updateCategory, enableLetters, resetPuzzleSquares } from "./client.js";


let game;

function updateGameState() {
    game = get("/game");
    resetPuzzleSquares();
    populatePuzzleSquares(game.lastPuzzle);
    updateCategory(game.lastPuzzle);
    newPlayerTurn(game);
    revealLetters(game);
    updateNames(game);
    updateCurrentSpin(game);
    enableLetters();
    endRoundBoard(game.players);
}

while(true) {
    updateGameState();
    await new Promise(resolve => setTimeout(resolve, 250));
}
