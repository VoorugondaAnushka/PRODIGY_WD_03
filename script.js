const statusDisplay = document.querySelector('.game--status');
const playerXBtn = document.querySelector('.choose-x');
const playerOBtn = document.querySelector('.choose-o');
const chooseSection = document.querySelector('.game--choose');

let gameActive = false;
let currentPlayer = "X";
let userPlayer = null;
let computerPlayer = null;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

function startGame(playerChoice) {
    userPlayer = playerChoice;
    computerPlayer = userPlayer === "X" ? "O" : "X";
    currentPlayer = "X";
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();

   
    chooseSection.style.display = 'none';

    if (currentPlayer === computerPlayer) {
        setTimeout(computerMove, 500);
    }
}

document.querySelectorAll('.cell').forEach(cell =>
    cell.addEventListener('click', handleCellClick)
);
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
playerXBtn.addEventListener('click', () => startGame("X"));
playerOBtn.addEventListener('click', () => startGame("O"));

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer !== userPlayer) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && currentPlayer === computerPlayer) {
        setTimeout(computerMove, 500);
    }
}

function handleCellPlayed(cell, index) {
    gameState[index] = currentPlayer;
    cell.innerHTML = currentPlayer;
}

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
    gameActive = false;
    currentPlayer = "X";
    userPlayer = null;
    computerPlayer = null;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = "Choose X or O to start the game";

    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    chooseSection.style.display = 'block';
}

function computerMove() {
    if (!gameActive) return;

    const emptyIndices = gameState
        .map((val, idx) => val === "" ? idx : null)
        .filter(idx => idx !== null);

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const cell = document.querySelector(`.cell[data-cell-index="${randomIndex}"]`);

    handleCellPlayed(cell, randomIndex);
    handleResultValidation();
}
