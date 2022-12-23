const display = document.getElementById("gameboard");
const gameboard = [['-','-','-'],['-','-','-'],['-','-','-']];

function displayBoard() {
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

const game = (function() {
    let currentTurn = 'X';

    let resetBoard = () => {
        this.turn = 'X';
        gameboard.forEach(function(outerList, row) {
            outerList.forEach(function(innerValue, col) {
                gameboard[row][col] = '-';
            })
        })
    };

    let move = (row, col) => {
        if (gameboard[row][col] === '-') {
            gameboard[row][col] = currentTurn;
        }
        else {
            alert("Invalid Move");
        }
    };

    let changeTurn = () => {
        currentTurn = (currentTurn === 'X') ? 'O':'X';
    }

    let checkWinner = () => {
        for (i=0; i<3; i++) {
            if (gameboard[0][i] == currentTurn && gameboard[1][i] == currentTurn && gameboard[2][i] == currentTurn ||
                gameboard[i][0] == currentTurn && gameboard[i][1] == currentTurn && gameboard[i][2] == currentTurn) {
                return true;
            }
        }
        if (gameboard[0][0] == currentTurn && gameboard[1][1] == currentTurn && gameboard[2][2] == currentTurn ||
            gameboard[2][0] == currentTurn && gameboard[1][1] == currentTurn && gameboard[0][2] == currentTurn) {
            return true;
        }

        return false;
    }

    return {currentTurn, resetBoard, move, checkWinner, changeTurn}
})()

display.addEventListener('click', function(e) {
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    game.move(row, col);
    displayBoard()
    if (game.checkWinner()) {
        alert(`${game.currentTurn} won!`)
    } 
    else {
        game.changeTurn()
    }
    
})

displayBoard()