// Game state
let board = Array(9).fill(null);
let currentPlayer = 'X';
let winner = null;
let winningLine = null;
let gameOver = false;
let xWins = 0;
let oWins = 0;
let draws = 0;

// DOM Elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');
const drawsElement = document.getElementById('draws');
const turnIndicator = document.getElementById('turn-indicator');
const currentPlayerSvg = document.getElementById('current-player-svg');
const xPlayer = document.querySelector('.x-player');
const oPlayer = document.querySelector('.o-player');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initialize game
initGame();

// Event Listeners
resetButton.addEventListener('click', resetGame);

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    handleCellClick(index);
  });
});

// Functions
function initGame() {
  updateBoard();
  updateTurnIndicator();
  updatePlayerIndicators();
}

function handleCellClick(index) {
  // Ignore if cell is already filled or game is over
  if (board[index] || gameOver) return;

  // Update board state
  board[index] = currentPlayer;
  
  // Check for winner
  const result = checkWinner();
  
  if (result.winner === 'X' || result.winner === 'O') {
    winner = result.winner;
    winningLine = result.line;
    gameOver = true;
    
    // Update scores
    if (winner === 'X') {
      xWins++;
      xScoreElement.textContent = xWins;
      showToast('Player X wins!');
    } else {
      oWins++;
      oScoreElement.textContent = oWins;
      showToast('Player O wins!');
    }
  } else if (result.winner === 'draw') {
    winner = 'draw';
    gameOver = true;
    draws++;
    drawsElement.textContent = draws;
    showToast("It's a draw!");
  } else {
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
  
  // Update UI
  updateBoard();
  updateTurnIndicator();
  updatePlayerIndicators();
}

function checkWinner() {
  // Check for winning combinations
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  
  // Check for draw
  if (!board.includes(null)) {
    return { winner: 'draw', line: null };
  }
  
  return { winner: null, line: null };
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  winner = null;
  winningLine = null;
  gameOver = false;
  
  updateBoard();
  updateTurnIndicator();
  updatePlayerIndicators();
}

function updateBoard() {
  cells.forEach((cell, index) => {
    // Clear cell content
    cell.innerHTML = '';
    cell.classList.remove('x', 'o', 'winning-cell');
    
    // Add player mark if cell is filled
    if (board[index] === 'X') {
      cell.classList.add('x');
      cell.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      `;
    } else if (board[index] === 'O') {
      cell.classList.add('o');
      cell.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      `;
    }
    
    // Highlight winning cells
    if (winningLine && winningLine.includes(parseInt(index))) {
      cell.classList.add('winning-cell');
    }
  });
}

function updateTurnIndicator() {
  if (gameOver) {
    turnIndicator.style.display = 'none';
  } else {
    turnIndicator.style.display = 'block';
    
    if (currentPlayer === 'X') {
      currentPlayerSvg.outerHTML = `
        <svg id="current-player-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      `;
    } else {
      currentPlayerSvg.outerHTML = `
        <svg id="current-player-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      `;
    }
  }
}

function updatePlayerIndicators() {
  xPlayer.classList.toggle('active', currentPlayer === 'X' && !gameOver);
  oPlayer.classList.toggle('active', currentPlayer === 'O' && !gameOver);
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}
