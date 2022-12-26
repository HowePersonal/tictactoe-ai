const display = document.getElementById("gameboard");
const popup = document.getElementById("popup");
const popupButton = document.getElementById("resetButton");
const selected = document.getElementById("modeSelector");
const gameboard = [['-','-','-'],['-','-','-'],['-','-','-']];


const UI = (function() {
    let displayBoard = () => {
        display.innerHTML = '';
        gameboard.forEach(function(outerList, row) {
            outerList.forEach(function(innerValue, col) {
                const cell = document.createElement("div");
                if (innerValue !== '-') {cell.innerText = innerValue;}
                cell.classList.add("cell");
                cell.setAttribute("data-row", row);
                cell.setAttribute("data-col", col);
                display.appendChild(cell);
            })
        })
    }

    let endScreen = (player) => {
        popup.style.display = "flex";
        popupButton.style.display = "block";

        let textDiv = document.createElement("div");
        textDiv.append(player + " Won");
        textDiv.id = "popupText"
        
        popup.appendChild(textDiv)
    }

    return {displayBoard, endScreen}
})()

const game = (function() {
    this.currentTurn = 'X';
    let aiTurn = 'O';
    let playerTurn = 'X';

    let getTurn = () => {
        return this.currentTurn;
    }

    let resetBoard = () => {
        this.currentTurn = 'X';
        gameboard.forEach(function(outerList, row) {
            outerList.forEach(function(innerValue, col) {
                gameboard[row][col] = '-';
            })
        })
    };

    let move = (row, col) => {
        if (gameboard[row][col] === '-') {
            gameboard[row][col] = this.currentTurn;
        }
        else {
            alert("Invalid Move");
        }
    }

    let changeTurn = () => {
        this.currentTurn = (this.currentTurn === 'X') ? 'O':'X';
    }

    let checkWinner = (turn, board) => {
        for (i=0; i<3; i++) {
            if ((board[0][i] == turn && board[1][i] == turn && board[2][i] == turn) ||
                (board[i][0] == turn && board[i][1] == turn && board[i][2] == turn)) {
                return true;
            }
        }
        if ((board[0][0] == turn && board[1][1] == turn && board[2][2] == turn) ||
            (board[2][0] == turn && board[1][1] == turn && board[0][2] == turn)) {
            return true;
        }

        return false;
    }

    /* AI Functions */
    function minimax(turn, board) { 
        if (checkWinner(playerTurn, board)) {
            return 1
        }
        else if (checkWinner(aiTurn, board)) {
            return -1
        } else if (emptySpots(board) == 0){
            return 0
        }

        if (turn === playerTurn) {
            let bestScore = -Infinity;
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                if (board[row][col] == '-') {
                  board[row][col] = playerTurn; 
                  let best = minimax(aiTurn, board);
                  board[row][col] = '-';
                  if (best > bestScore) {
                    bestScore = best
                }
                }
              }
            }
            return bestScore;
          } else {
            let bestScore = Infinity;
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                if (board[row][col] == '-') {
                  board[row][col] = aiTurn;
                  let best = minimax(playerTurn, board);
                  board[row][col] = '-';
                  if (best < bestScore) {
                    bestScore = best
                }
                }
              }
            }
            return bestScore;
          }

    }

    function aiMove() {
        let worstScore = 100
        let worstScoreCoord = []
        for (row=0; row<3; row++) {
            for (col=0; col<3; col++) {
                if (gameboard[row][col] == '-') {
                    gameboard[row][col] = aiTurn
                    let worst = minimax(playerTurn, gameboard)
                    gameboard[row][col] = '-'
                    if (worst < worstScore) {
                        worstScore = worst
                        worstScoreCoord = [row, col]
                    }
                    
                }
            }
        }
        gameboard[worstScoreCoord[0]][worstScoreCoord[1]] = aiTurn
    }


    let emptySpots = (board) => {
        let spots = 0;
        board.forEach(function(outerList, row) {
            outerList.forEach(function(innerValue, col) {
                if (board[row][col] === '-') {
                    spots++;
                }
            })
        })
        
        return spots;
    }

    return {getTurn, resetBoard, move, checkWinner, changeTurn, aiMove, emptySpots}
})()

display.addEventListener('click', function(e) {
    if (game.emptySpots(gameboard) === 9) {
        selected.disabled = true
    }
 
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    let turn = game.getTurn();
    
    if (selected.value == "player") {
        game.move(row, col);
        UI.displayBoard()
        if (game.checkWinner(turn, gameboard)) {
            UI.displayBoard()
            UI.endScreen(turn)
        } 
        else {
            UI.displayBoard()
            game.changeTurn()
        }
    }
    else if (selected.value == "AI") {
        game.move(row, col);
        UI.displayBoard()
        if (game.checkWinner('X', gameboard)) {
            UI.displayBoard()
            UI.endScreen('X')
        }
        else {
            game.aiMove()
            if (game.checkWinner('O', gameboard)) {
                UI.displayBoard()
                UI.endScreen('O')
            }
        }
        
        UI.displayBoard()
    }



    
})

resetButton.addEventListener('click', function() {
    game.resetBoard();
    popup.style.display = "none";
    popupButton.style.display = "none";
    document.getElementById("popupText").remove();
    selected.disabled = false;
    UI.displayBoard()
})

UI.displayBoard()