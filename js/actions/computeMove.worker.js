import { Board, AlphaBetaPlayer } from 'reversi.js'

const board = new Board()
const alphaBetaPlayer = new AlphaBetaPlayer()

self.addEventListener('message', e => {

    board.initialize()

    for (let move of e.data) {
        board.pushMove(move.place)
    }

    alphaBetaPlayer.computeMove(board, bestMove => {
        self.postMessage(bestMove)
    })
})