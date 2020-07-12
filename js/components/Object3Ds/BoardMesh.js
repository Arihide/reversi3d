import DiscMeshFactory from './DiscMeshFactory'
import DiscAnimator from './DiscAnimator'

import store from 'js/store'

import { Black, White, Pass, Board, Squares } from 'reversi.js'
import Bitop from 'reversi.js/src/Bitop'

import { Vector3, Mesh } from 'three'
import { changeTurn, placeDisc, computeMove } from '../../actions'

const NoAnimator = {
    update: function () {

    },
    playPlacingAnim: function () {
        return Promise.resolve()
    },
    playFlipingAnim: function () {
        return Promise.resolve()
    }
}

const DiscAnimatorInstance = new DiscAnimator()

let state

export default class BoardMesh extends Mesh {

    constructor(geometry, material) {
        super(geometry, material)
        this.defaultColor = [0.08627450980392157, 0.48627450980392156, 0.32941176470588235]
        this.brightColor = [0.933, 0.933, 0.666]
        this.discAnimator = DiscAnimatorInstance

        this.discTable = new Array(64)

        store.subscribe(this.onChange.bind(this))
        state = store.getState()

        // デバッグ用
        document.addEventListener('keydown', event => {
            if (process.env.NODE_ENV !== "development") return

            const keyName = event.key;

            if (keyName === "r") {

                if (state == null) return

                this.reset()

                const board = new Board()

                board.initialize()

                for (let move of state.playedMoves) board.pushMove(move.place)

                // 石置き直し
                for (let color of [Black, White]) {

                    let square = Bitop.bitScan(board.bitboard[color]);
                    while (square !== -1) {
                        this.placeDisc(square, color)
                        square = Bitop.bitScan(board.bitboard[color], square + 1);
                    }

                }

                for (let square of state.movableSquares) {

                    let start = square * 12
                    this.geometry.attributes.color.array.set(this.brightColor, start)
                    this.geometry.attributes.color.array.copyWithin(start + 3, start, start + 3)
                    this.geometry.attributes.color.array.copyWithin(start + 6, start, start + 6)

                }

            }
        })
    }

    reset() {

        this.discTable = new Array(64)

        while (this.children.length > 0) {

            this.remove(this.children[0])

        }

        this.geometry.attributes.color.needsUpdate = true

        for (let square of Object.values(Squares)) {

            let start = square * 12
            this.geometry.attributes.color.array.set(this.defaultColor, start)
            this.geometry.attributes.color.array.copyWithin(start + 3, start, start + 3)
            this.geometry.attributes.color.array.copyWithin(start + 6, start, start + 6)

        }

    }

    onBeforeRender() {

        this.discAnimator.update()

    }

    onClick(intersection) {

        let square = Math.floor(intersection.faceIndex / 2)

        if (state.movableSquares.includes(square) && state.players[state.turn] == "Human") {

            store.dispatch(placeDisc(state, square))

        }

    }

    onChange() {

        let prevState = state
        state = store.getState()

        if (prevState.page !== state.page && state.page === "title") this.reset()

        if (state.page !== "game") return

        if (state.settings.animationEnabled !== prevState.settings.animationEnabled) {

            this.discAnimator = state.settings.animationEnabled ? DiscAnimatorInstance : NoAnimator

        }

        if (state.initialBoard !== prevState.initialBoard) {

            this.onInitialBoardUpdate()

        }

        if (state.movableSquares !== prevState.movableSquares) {

            this.geometry.attributes.color.needsUpdate = true

            for (let square of prevState.movableSquares) {

                let start = square * 12
                this.geometry.attributes.color.array.set(this.defaultColor, start)
                this.geometry.attributes.color.array.copyWithin(start + 3, start, start + 3)
                this.geometry.attributes.color.array.copyWithin(start + 6, start, start + 6)

            }

            let color = state.players[state.turn] === "Human" ? this.brightColor : this.defaultColor

            for (let square of state.movableSquares) {

                let start = square * 12
                this.geometry.attributes.color.array.set(color, start)
                this.geometry.attributes.color.array.copyWithin(start + 3, start, start + 3)
                this.geometry.attributes.color.array.copyWithin(start + 6, start, start + 6)

            }

        }

        if (state.playedMoves.length > prevState.playedMoves.length) {

            let move = state.playedMoves[state.playedMoves.length - 1]
            this.doMove(move)

        } else if (state.playedMoves.length < prevState.playedMoves.length) {

            let moves = prevState.playedMoves.slice(
                state.playedMoves.length,
                prevState.playedMoves.length)
            this.undoMove(moves)

        }

        if (prevState.turn !== state.turn &&
            state.players[state.turn] === "Human" &&
            state.movableSquares.length === 0) {

            store.dispatch(placeDisc(state, Pass))

        }

        if (prevState.turn !== state.turn && state.players[state.turn] === "Computer") {

            computeMove(state).then(action => store.dispatch(action))

        }
    }

    async onInitialBoardUpdate() {

        this.reset()

        let promises = []

        for (let color of [Black, White]) {

            for (let square of state.initialBoard[color]) {

                promises.push(this.placeDisc(square, color))

            }

        }

        await Promise.all(promises)
        store.dispatch(changeTurn(state))

    }

    async doMove(move) {

        if (move.place === Pass) {
            store.dispatch(changeTurn(state))
            return
        }

        let promises = []

        promises.push(this.placeDisc(move.place, move.color))

        for (let place of move.flip) {

            promises.push(this.flipDisc(place, move.color))

        }

        await Promise.all(promises)
        store.dispatch(changeTurn(state))

    }

    async undoMove(moves) {

        for (let i = moves.length - 1; i !== -1; i--) {

            let move = moves[i]

            if (move.place === Pass) continue

            let promises = []

            let disc = this.getObjectByProperty("userData", move.place)
            this.remove(disc)
            this.discTable[move.place] = null

            for (let place of move.flip) {

                promises.push(this.flipDisc(place, move.color == Black ? White : Black))

            }

            await Promise.all(promises)

        }

        store.dispatch(changeTurn(state))

    }

    async placeDisc(square, color) {

        let discPromise = this.discTable[square] = this.discTable[square] || DiscMeshFactory.create(square, color)

        let animPromise = discPromise.then(mesh => {
            this.add(mesh)
            mesh.position.copy(this.getDiscMeshPositionFromSquare(mesh.userData))
            return this.discAnimator.playPlacingAnim(mesh, color)
        })

        return animPromise
    }

    async flipDisc(square, afterColor) {

        let discPromise = this.discTable[square]

        return discPromise.then(mesh => {

            return this.discAnimator.playFlipingAnim(mesh, afterColor).then(() => {

                if (afterColor === 0) mesh.quaternion.set(0, 0, 0, 1)
                else mesh.quaternion.set(0, 0, -1, 0)

            })

        })

    }

    getDiscMeshPositionFromSquare(square) {
        let pos3D = new Vector3()
        pos3D.x = (square % 8 - 4) * (37 + 1.5) + 18.5 + 0.75
        pos3D.z = (Math.floor(square / 8) - 4) * (37 + 1.5) + 18.5 + 0.75
        return pos3D
    }

}