'use strict'

var gBoard
var gGame
var gCurrCell
const block = '<img src="img/gray.jpg">'
const bomb = '<img src="img/bomb.jpg">'
var bombLocation =
    { i: 1, j: 1 }
var size = 4



function onInit() {
    gGame = {
        isOn: false,
        revealedCount: false,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard()
    gCurrCellNegs(gBoard)
    renderBoard(gBoard)
}


function buildBoard() {
    var size = 4
    var board = []
    var id = 0


    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            var gCurrCell = board[i][j]
            board[i][j] = {
                id : id++,
                gameElement: block,
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }
            if (i === bombLocation.i && j === bombLocation.j) {
                board[i][j].isMine = true
            }
            var gCurrCell = board[i][j]
        }
    }

    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j].gameElement
            // const className = `cell cell-${i}-${j}`
            // strHTML += `<td class="${className}">${cell}</td>`

            strHTML += `<td>${cell}</td>`
        }

        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}


function setMinesNegsCount(rowIdx, colIdx, mat) {
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].isMine === true)
                neighborsCount++
        }
    }
    return neighborsCount
}



function gCurrCellNegs(gBoard) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            var numOfNeighbors = setMinesNegsCount(i, j, gBoard)
            gBoard[i][j].minesAroundCount = numOfNeighbors
            console.log(gBoard[i][j])
        }
    }

}

// function renderBoard(board) {
//     var strHTML = ''
//     var counter = 0

//     for (var i = 0; i < size; i++) {
//         strHTML += `<tr>`
//         for (var j = 0; j < size; j++) {
//            const cell = board[i][j].gameElement
//             strHTML += `
//             <td class="cell" onclick="onCellClicked(this,${cell})
//                 ${cell}>
//             </td>
//             `
//         }
//         strHTML += `</tr>`
//     }
//     const elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML
// }


