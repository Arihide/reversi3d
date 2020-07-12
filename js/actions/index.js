import { Board, HumanPlayer, AlphaBetaPlayer, Squares, Pass } from 'reversi.js'
import Worker from "./computeMove.worker.js"

const board = new Board()
const alphaBetaPlayer = new AlphaBetaPlayer()

export function startGame(inputData) {

    let players

    if (inputData.num === 1) {
        players = inputData.color === "b" ? ["Human", "Computer"] : ["Computer", "Human"]
    } else {
        players = ["Human", "Human"]
    }

    board.initialize()

    return {
        type: "START_GAME",
        // players: ["Computer", "Computer"],
        players: players,
        initialBoard: board.initialBoard,
    }
}

export function finishGame() {

    return {
        type: "FINISH_GAME"
    }

}

export function changePage(page) {

    if (page == "title") return {
        type: "BACK_TITLE",
        payload: page
    }

    return {
        type: "CHANGE_PAGE",
        payload: page
    }

}

export function placeDisc(state, square) {

    board.initialize()

    for (let move of state.playedMoves) {
        board.pushMove(move.place)
    }

    board.pushMove(square)

    if (square === Pass && board.legalMoves.length === 0) {

        return {
            type: "FINISH_GAME",
        }

    }

    return {
        type: "PLACE_DISC",
        turn: board.turn,
        playedMoves: [...board.playedMoves],
        movableSquares: board.legalMoves,
        blackDiscNum: board.blackDiscNum,
        whiteDiscNum: board.whiteDiscNum,
    }
}

const worker = new Worker()

export async function computeMove(state) {

    if (worker) {

        return new Promise(resolve => {
            worker.addEventListener("message", e => {
                resolve(placeDisc(state, e.data))
            }, { once: true })
            worker.postMessage(state.playedMoves)
        })

    } else {

        board.initialize()

        for (let move of state.playedMoves) {
            board.pushMove(move.place)
        }

        return new Promise(resolve => {
            alphaBetaPlayer.computeMove(board, bestMove => {
                resolve(placeDisc(state, bestMove))
            })
        })

    }
}

export function undoMove(state) {

    if (state.playedMoves.length === 0) return { type: "NOOP" }

    board.initialize()

    // 一手減らす
    for (let move of state.playedMoves.slice(0, -1)) {
        board.pushMove(move.place)
    }

    // 戻した後コンピュータの手、もしくはパスだったらさらに戻す
    while (
        board.playedMoves.length !== 0 && 
        (
            state.players[board.turn] === "Computer" || 
            (state.players[board.turn] === "Human" &&  board.legalMoves.length === 0)
        )
    )
        board.popMove()

    return {
        type: "PLACE_DISC",
        turn: board.turn,
        playedMoves: [...board.playedMoves],
        movableSquares: board.legalMoves,
        blackDiscNum: board.blackDiscNum,
        whiteDiscNum: board.whiteDiscNum,
    }
}

export function changeTurn(state) {

    board.initialize()

    for (let move of state.playedMoves) {
        board.pushMove(move.place)
    }

    return {
        type: "CHANGE_TURN",
        turn: board.turn,
        movableSquares: board.legalMoves,
    }

}

export function toggleAnimation(bool) {
    return {
        type: "TOGGLE_ANIMATION",
        payload: bool
    }
}

export function changeQuality(qualityLevel) {
    return {
        type: "CHANGE_QUALITY",
        payload: qualityLevel,
    }
}
