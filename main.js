'use strict'

var gBombCount = 0
var gBoard
var gCopyBoard = gBoard
var gGame
var gCurrCell
const picked = '<img src="img/light-gray.jpg">'
const block = '<img src="img/gray.jpg">'
const bomb = '<img src="img/bomb.jpg">'
var bombLocation = []
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

            board[i][j] = {
                id: id++,
                gameElement: block,
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }


        }
    }
    return board
}




function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            if (checkBomb(i, j) === true) {
                board[i][j].isMine = true
            }

            var cell = board[i][j].gameElement
            var id = board[i][j].id
            //const className = `cell (cell-${i}-${j})`
            if (board[i][j].minesAroundCount !== 0 && board[i][j].gameElement === picked) {
                strHTML += `
            <td class="cell" onClick=onCellClicked(${id})>
            ${board[i][j].minesAroundCount}
            </td>
            `
            } else
                strHTML += `
            <td class="cell" onClick=onCellClicked(${id})>
            ${cell}
            </td>
            `


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
            //console.log(gBoard[i][j])
        }
    }

}


function onCellClicked(id) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var test = gBoard[i][j]
            if (test.id === id) {
                if (test.minesAroundCount !== 0) {
                    var mineNum = gBoard[i][j].markedCount
                    gBoard[i][j].markedCount = mineNum
                    renderBoard(gBoard)
                }
                if (test.isMine === true) {
                    gBoard[i][j].gameElement = bomb
                    renderBoard(gBoard)
                } else { gBoard[i][j].gameElement = picked }
                addBomb()
                gCurrCellNegs(gBoard)
                renderBoard(gBoard)
            }

        }
    }


}

function addBomb() {

    if (gBombCount >= size / 2) {
        return
    }

    for (var i = 0; i < size / 2; i++) {
        var row = getRandomInt(0, size)
        var coll = getRandomInt(0, size)
        bombLocation.push({
            i: row,
            j: coll
        })
        gBombCount++
    }
    console.log(bombLocation)
   


}

function checkBomb(locI, locJ) {

    for (var i = 0; i < bombLocation.length; i++) {
        var currLocation = bombLocation[i]
        if (currLocation.i === locI &&
            currLocation.j === locJ
        ) {
            return true

        }

    }
    return false
}









function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
