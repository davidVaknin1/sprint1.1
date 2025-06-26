'use strict'

var gBombCount = 0
var gBoard
var gCopyBoard = gBoard
var gBombCounter
var gGame
var gCurrCell
const picked = '<img src="img/light-gray.jpg">'
const block = '<img src="img/gray.jpg">'
const bomb = '<img src="img/bomb.jpg">'
var bombLocation = []
var gLevel = 0
var gLIVES = 3
var gCurrTest
const flag = '<img src="img/flag.png">'
var flagCount = 0
const happyEmoji = '<img src="img/happy.png">'
const blowEmoji = '<img src="img/blow.png">'
const winEmoji = '<img src="img/win.png">'


function onInit() {
    
    gGame = {
        isOn: true,
        revealedCount: false,
        markedCount: 0,
        secsPassed: 0
    }

    gBoard = buildBoard()
    addBomb()
    gCurrCellNegs(gBoard)
    renderBoard(gBoard)
    renderLIVES(gLIVES)
    renderBombAlert()
    renderSmiley(happyEmoji)



}


function onChangeDifficulty(level, bombCounter) {
    gLevel = level
    gBombCounter = bombCounter
    gLIVES = 3
    bombLocation = []
    onInit()
}




function buildBoard() {

    var board = []
    var id = 0


    for (var i = 0; i < gLevel; i++) {
        board.push([])

        for (var j = 0; j < gLevel; j++) {

            board[i][j] = {
                i: i,
                j: j,
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
            <td class="cell" onClick=onCellClicked(${id}) oncontextmenu=addFlag(${id})>
            ${board[i][j].minesAroundCount}
            </td>
            `
                continue
            } if (board[i][j].isMarked === true) {

                strHTML += `
            <td class="cell" onClick=onCellClicked(${id}) oncontextmenu=addFlag(${id})>
            ${flag} 
            </td>
            `
                continue
            } else
                strHTML += `
            <td class="cell" onClick=onCellClicked(${id}) oncontextmenu=addFlag(${id})>
            ${cell} 
            </td>
            `


        }

        strHTML += '</tr>'
    }
    renderLIVES(gLIVES)
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
    checkGameOver()




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
    if (gGame.isOn === false) {
        return
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var test = gBoard[i][j]
            if (test.id === id) {
                gCurrTest = " "
                gCurrTest = gBoard[i][j]
                console.log(gCurrTest)
                if (test.minesAroundCount !== 0) {
                    var mineNum = gBoard[i][j].markedCount
                    gBoard[i][j].markedCount = mineNum
                    gBoard[i][j].isRevealed = true
                    renderBoard(gBoard)
                }
                if (test.isMine === true) {
                    gLIVES--
                    gBoard[i][j].gameElement = bomb
                    gBoard[i][j].isRevealed = true
                    showElement('.bombalert')
                    renderSmiley(blowEmoji)
                    renderBoard(gBoard)
                    setTimeout(bombAlert, 3000)
                    //gBoard[i][j].gameElement = block
                    //hideElement('.bombalert')
                    console.log(gLIVES)
                    //renderBoard(gBoard)

                } else {
                    gBoard[i][j].gameElement = picked
                    gBoard[i][j].isRevealed = true
                }
                addBomb()
                gCurrCellNegs(gBoard)
                renderBoard(gBoard)
                checkGameOver()
                renderLIVES(gLIVES)

            }

        }
    }


}

function addBomb() {

    if (bombLocation.length >= gBombCounter) {
        return
    }

    for (var i = 0; i < gBombCounter; i++) {
        var row = getRandomInt(0, gLevel)
        var coll = getRandomInt(0, gLevel)
        if (gBoard[row][coll].gameElement === picked) {
            continue
        }
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

function renderLIVES(LIVES) {
    var strHTML = ''
    strHTML += `<divclass= "LIVES"> lives left: ${LIVES}</div>`
    var elLives = document.querySelector('.LIVES')
    elLives.innerHTML = strHTML
}

function checkGameOver() {
    if (gLIVES === 0) {
        console.log('you lost')
        renderSmiley(blowEmoji)
        gGame.isOn = false
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++)
            if (gBoard[i][j].isRevealed !== true) {
                return
            }
    }
    
    renderSmiley(winEmoji)
    gGame.isOn = false
}

window.oncontextmenu = function () {
    return false
}


function renderBombAlert() {
    var strHTML = ''
    var msg = "you touched a bomb please put a flag on it"
    strHTML += `<divclass= "bombalert">${msg}</div>`
    var elBombAlert = document.querySelector('.bombalert')
    elBombAlert.innerHTML = strHTML

}

function bombAlert() {
    renderSmiley(happyEmoji)
    hideElement('.bombalert')
    gBoard[gCurrTest.i][gCurrTest.j].gameElement = block
    renderBoard(gBoard)


    console.log('hi')
}


function hideElement(selector) {
    const el = document.querySelector(selector)
    el.classList.add('hide')
}

function showElement(selector) {
    const el = document.querySelector(selector)
    el.classList.remove('hide')
}

// var elTable = document.querySelector('table')
// elTable.addEventListener('contextmenu', flag)

function addFlag(id) {


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++)
            if (id === gBoard[i][j].id) {
                if (gBoard[i][j].isMarked === true) {
                    gBoard[i][j].gameElement = block
                    gBoard[i][j].isMarked = false
                    flagCount--
                    renderBoard(gBoard)
                    return
                }
                if (flagCount >= gBombCount) {
                    return
                }
                gBoard[i][j].isMarked = true
                gBoard[i][j].isRevealed = true
                renderBoard(gBoard)
                flagCount++
            }
    }


}


function renderSmiley(emoji) {
    var strHTML = ''
    strHTML += `<h3class= "emoji" onClick=resetEmoji()>${emoji}</h3>`
    var elEmoji = document.querySelector('.emoji')
    elEmoji.innerHTML = strHTML
}

function resetEmoji() {
    
    window.location.reload()

}









function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
