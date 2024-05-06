
    let board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    let currentPlayer = 'X';
    let gameOver = false;

    let turn = document.getElementsByClassName('turn');

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    function displayBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.textContent = board[row][col];
        });
    }
    
    function solve(r,c)
    {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            if(row==r && c==col){
                cell.style.backgroundColor="green";
            }
        });
    }

    function checkWinner(player) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return true;
            }
            if(board[0][i] === player && board[1][i] === player && board[2][i] === player) {
                return true;
            }
        }
        if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
            (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
            return true;
        }
        return false;
    }

    function isGameOver() {
        return checkWinner('X') || checkWinner('O') || !board.some(row => row.includes(' '));
    }

    function evaluate() {
        if (checkWinner('X')) {
            return 10;
        } else if (checkWinner('O')) {
            return -10;
        } else {
            return 0;
        }
    }

    function minimax(depth, isMaximizingPlayer) {
        if (isGameOver()) {
            return evaluate();
        }

        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === ' ') {
                        board[i][j] = 'X';
                        let score = minimax(depth + 1, false);
                        board[i][j] = ' ';
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === ' ') {
                        board[i][j] = 'O';
                        let score = minimax(depth + 1, true);
                        board[i][j] = ' ';
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    function findBestMove() {
        let bestMove = { row: -1, col: -1 };
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === ' ') {
                    board[i][j] = 'X';
                    let score = minimax(0, false);
                    board[i][j] = ' ';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row: i, col: j };
                    }
                }
            }
        }
        return bestMove;
    }

   async function handleCellClick(event) {
        if (gameOver) return;
        const cell = event.target;
        event.target.style.backgroundColor="yellow";
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        if (board[row][col] === ' ') {
            board[row][col] = 'O';
            turn[0].innerHTML="COMPUTER TURN : THINKING...";
            displayBoard();
            await sleep(1000)
            if (!isGameOver()) {
                const bestMove = findBestMove();
                solve(bestMove.row, bestMove.col);
                board[bestMove.row][bestMove.col] = 'X';
                displayBoard();
                turn[0].innerHTML = "YOUR TURN";
            }
        }
        if (isGameOver()) {
            const result = document.querySelector('.result');
            if (checkWinner('X')) {
                result.textContent = "AI wins!";
            } else if (checkWinner('O')) {
                result.textContent = "You win!";
            } else {
                result.textContent = "It's a draw!";
            }
            gameOver = true;
            turn[0].style.display="none";
        }
    }

    function resetGame() {
        board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        currentPlayer = 'X';
        gameOver = false;
        turn[0].style.display="block";
        displayBoard();
        document.querySelector('.result').textContent = '';
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.style.backgroundColor="grey";
            cell.textContent = '';
        });
        turn[0].innerHTML = "YOUR TURN";
    }

    displayBoard();
