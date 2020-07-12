import React from 'react'
import { connect } from 'react-redux'

import { startGame } from '../actions'

import NewGame from './NewGame'

@connect((store) => {
    return store
}, (dispatch) => {
    return {
        startGame(state) {
            dispatch(startGame({
                ...state,
                color: Math.random() < 0.5 ? "b" : "w",
            }))
        }
    }
})
export default class TitleComponent extends React.Component {

    constructor(props) {

        super(props)

    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.page === "title" || nextProps.page === "title") {
            return true
        }

        return false

    }

    render() {

        if (this.props.page !== "title") {
            return (null)
        }

        return (
            <NewGame onRequestNewGame={this.props.startGame} />
        )
    }

}