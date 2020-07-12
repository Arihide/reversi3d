import { Black, White } from 'reversi.js'

const initialState = {

    page: "loading", // loading, title, game, result

    // Initial Game Parameter
    players: [null, null],　// Human, Computer
    initialBoard: [[], []],

    // Current Game State
    turn: -1,
    blackDiscNum: 0,
    whiteDiscNum: 0,
    playedMoves: [],
    movableSquares: [],

    // Settings
    settings: {
        animationEnabled: true,
        quality: 1, // 描画品質
    },
}

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case "START_GAME":
            return {
                ...state,
                page: "game",
                players: action.players,
                initialBoard: action.initialBoard,
                blackDiscNum: action.initialBoard[Black].length,
                whiteDiscNum: action.initialBoard[White].length,
            }
        case "CHANGE_TURN":
            return {
                ...state,
                turn: action.turn,
                movableSquares: action.movableSquares,
            }
        case "PLACE_DISC":
            return {
                ...state,
                playedMoves: action.playedMoves,
                movableSquares: [],
                blackDiscNum: action.blackDiscNum,
                whiteDiscNum: action.whiteDiscNum,
            }
        case "FINISH_GAME":
            return {
                ...state,
                page: "result",
                turn: -1, // 手番が点灯しないように
                movableSquares: [],
            }
        case "CHANGE_PAGE":
            return {
                ...state,
                page: action.payload,
            }
        case "BACK_TITLE":
            return {
                ...initialState,
                page: "title",
                settings: state.settings,
            }
        case "TOGGLE_ANIMATION":
            return {
                ...state,
                settings: {
                    ...state.settings,
                    animationEnabled: action.payload,
                },
            }
        case "CHANGE_QUALITY":
            return {
                ...state,
                settings: {
                    ...state.settings,
                    quality: action.payload,
                },
            }
        default:
            return state

    }

}