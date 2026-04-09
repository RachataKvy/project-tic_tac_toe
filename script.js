// 01 The Gameboard object for storing board array, placing a mark, and returning the current state
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
            console.log(`${players[currentPlayerIndex].name} wins!`);
            gameOver = true;
            return;
        }
        if (checkTie()) {
            console.log("It's a tie!");
            gameOver = true;
            return;
        }
        switchTurn();

    };

    return { startGame, playRound,};
})() // These parentheses call the function immediately

// Game 1 - Alice wins
const player1 = createPlayer("Alice", "X");
const player2 = createPlayer("Bob", "O");
GameController.startGame(player1, player2);
GameController.playRound(0); // X
GameController.playRound(3); // O
GameController.playRound(1); // X
GameController.playRound(4); // O
GameController.playRound(2); // X wins!

// Game 2 - test reset works
GameController.startGame(player1, player2);
Gameboard.getBoard(); // should show 9 empty strings!