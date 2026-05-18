//# 01 The Gameboard object for storing board array, placing a mark, and returning the current state
const Gameboard = (() => {
    const board = [
        "", "", "", 
        "", "", "", 
        "", "", ""
    ];

    const getBoard = () => board;

    const placeMarker = (index, symbol) => {
        if (board[index] === "") {
            board[index] = symbol;
            return true;
        }
        return false;
    };

    // Reset board
    const resetBoard = () => {
        board.forEach((square, index) => {
            board[index] = "";
        });
    };

    return { getBoard, placeMarker, resetBoard};

})();

// 02 Player factory function
const createPlayer = (name, symbol) => {
    return {
        name,
        symbol
    };
};

// 03 GameController
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1, player2) => {
        Gameboard.resetBoard();
        players = [player1, player2];
        currentPlayerIndex = 0;
        gameOver = false;
    };

    // Switching Turn Logic 
    const switchTurn = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    // Check for Winner from the Combinations 
    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6],            // Diagonals
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
                return players[currentPlayerIndex];
            }
        }
        return null;
    };

    // Check for Tie by the board state
    const checkTie = () => {
        return Gameboard.getBoard().every((square) => square !== "");
    };

    // Play round Logic
    const playRound = (index) => {
        
        if (gameOver) return;

        Gameboard.placeMarker(index, players[currentPlayerIndex].symbol);

        if (checkWinner()) {
            DisplayController.updateStatus(`${players[currentPlayerIndex].name} wins!`);
            gameOver = true;
            return;
        }
        if (checkTie()) {
            DisplayController.updateStatus("It's a tie!");
            gameOver = true;
            return;
        }
        switchTurn();
        // Show whose turn it is after switching
        DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
    };

    return { startGame, playRound,};
})() // These parentheses call the function immediately

// Display the board on the html
const DisplayController = (() => {
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const squares = document.querySelectorAll("#board div");

        squares.forEach((square, index) => {
            square.textContent = board[index];
        });
    };

    const setupClickListeners = () => {
        const squares = document.querySelectorAll("#board div");
        squares.forEach((square) => {
            square.addEventListener("click", (event) => {
                const index = parseInt(event.target.dataset.index);
                GameController.playRound(index);
                renderBoard();
            });
        });
    };

    // Show status message
    const updateStatus = (message) => {
        document.getElementById("status").textContent = message;
    };

    const setupForm = () => {
        let player1;
        let player2;

        const form = document.getElementById("setup-form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const name1 = document.getElementById("player1").value || "Player 1";
            const name2 = document.getElementById("player2").value || "Player 2";
            player1 = createPlayer(name1, "X");
            player2 = createPlayer(name2, "O");
            GameController.startGame(player1, player2);
            renderBoard();
            updateStatus(`${name1}'s turn`);
        });
        // restart button
        document.getElementById("restart-btn").addEventListener("click", () => {
            GameController.startGame(player1, player2);
            renderBoard();
            updateStatus(`${player1.name}'s turn`);
        });
    };

    return { renderBoard, setupClickListeners, updateStatus, setupForm };
})()


DisplayController.setupClickListeners();
DisplayController.setupForm();