const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const modeSelect = document.getElementById('modeSelect');
const gridSelect = document.getElementById('gridSelect');
const popSound = document.getElementById('popSound');
const winSound = document.getElementById('winSound');

let currentPlayer = 'X';
let gameState = [];
let boardSize = 4;
let scores = { X: 0, O: 0 };
let gameActive = true;
let aiMode = false;

modeSelect.addEventListener('change', () => {
  aiMode = modeSelect.value === 'ai';
  resetGame();
});

gridSelect.addEventListener('change', () => {
  boardSize = parseInt(gridSelect.value);
  resetGame();
});

function createBoard() {
  board.innerHTML = '';
  board.classList.remove('grid-3', 'grid-4', 'grid-5');
  board.classList.add(`grid-${boardSize}`);
  gameState = Array(boardSize * boardSize).fill('');

  for (let i = 0; i < gameState.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || gameState[index] !== '') return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('bounce');
  popSound.play();

  if (checkWinner()) {
    statusDisplay.textContent = `Player ${currentPlayer} wins! 🎉`;
    winSound.play();
    gameActive = false;
    scores[currentPlayer]++;
    updateScore();
    highlightWinningCells();
    showPartyPop();
    return;
  }

  if (!gameState.includes('')) {
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

  if (aiMode && currentPlayer === 'O') {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  let emptyIndices = gameState
    .map((val, idx) => (val === '' ? idx : null))
    .filter((val) => val !== null);

  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cell = board.querySelector(`[data-index='${move}']`);
  handleCellClick({ target: cell });
}

function checkWinner() {
  const lines = [];

  // Rows
  for (let r = 0; r < boardSize; r++) {
    lines.push([...Array(boardSize).keys()].map(c => r * boardSize + c));
  }

  // Columns
  for (let c = 0; c < boardSize; c++) {
    lines.push([...Array(boardSize).keys()].map(r => r * boardSize + c));
  }

  // Diagonals
  lines.push([...Array(boardSize).keys()].map(i => i * (boardSize + 1)));
  lines.push([...Array(boardSize).keys()].map(i => (i + 1) * (boardSize - 1)));

  return lines.some(line => {
    const [first, ...rest] = line;
    if (gameState[first] && rest.every(i => gameState[i] === gameState[first])) {
      line.forEach(i => board.children[i].classList.add('win'));
      return true;
    }
  });
}

function updateScore() {
  scoreX.textContent = `X: ${scores.X}`;
  scoreO.textContent = `O: ${scores.O}`;
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = "Player X's turn";
  createBoard();
}

function highlightWinningCells() {
  // already handled in checkWinner
}

function showPartyPop() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Confetti setup
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
document.body.appendChild(script);

// Initial setup
createBoard();
