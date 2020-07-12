import React from 'react'
import { connect } from 'react-redux'
import { changePage } from '../actions'
import Fade from './Fade'

@connect((store) => {
    return store
}, (dispatch) => {
    return {
        changeResultPage() {
            dispatch(changePage("result"))
        },

        changeTitlePage() {
            dispatch(changePage("title"))
        }
    }
})
export default class ResultComponent extends React.Component {

    constructor(props) {
        super(props)

    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.page !== nextProps.page) {

            if (this.props.page === "result" || nextProps.page === "result") {
                return true
            }
        }

        return false

    }

    generateResultMessage() {

        let winner = this.props.blackDiscNum > this.props.whiteDiscNum ? 0 : 1

        if (this.props.blackDiscNum === this.props.whiteDiscNum) {
            return "Draw"
        }

        if (this.props.players[0] == "Human" && this.props.players[1] == "Human") {
            if (winner === 0) {
                return "Black win"
            } else {
                return "White win"
            }

        } else if (this.props.players[winner] == "Human") {
            return "You win"
        } else if (this.props.players[winner] == "Computer") {
            return "You lose"
        }

    }

    render() {

        if (this.props.page !== "result") {
            return null
        }

        return (
            <Fade in={this.props.page === "result"} duration={300} appear={true}>
                <div id="reversi-result">
                    <div id="reversi-result-message">{this.generateResultMessage()}</div>
                    <button className="reversi-button reversi-back-button" onClick={this.props.changeTitlePage}>Back to title</button>
                </div>
            </Fade>
        )
    }

}