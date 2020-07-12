import React from 'react'
import { connect } from 'react-redux'

import DiscNumCounter from './DiscNumCounter'
import ComputingIndicator from './ComputingIndicator'
import PassIndicator from './PassIndicator'

import 'scss/info.scss'
import { Black, White } from 'reversi.js/src'

@connect((store) => {
    return store
}, (dispatch) => {
    return {
        _animate(promise) {
            dispatch(animate(promise))
        }
    }
})
export default class Menubar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            showPass: false

        }
    }

    componentDidUpdate(prevProps) {

        if (prevProps.playedMoves.length < this.props.playedMoves.length) {

            if (this.props.playedMoves[this.props.playedMoves.length - 1].place === 64) {
                this.setState({ showPass: true })
            }

        }

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true

    }

    componentDidUpdate(prevProps) {

        if (this.state.showPass === true) {
            this.props._animate(new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.setState({ showPass: false })
                    resolve()
                }, 1000)
            }))
        }

    }

    render() {

        if (this.props.page !== "game" && this.props.page !== "result") return (<div id="reversi-info"></div>)

        return (
            <div id="reversi-info">
                <DiscNumCounter color="black" count={this.props.blackDiscNum} turn={this.props.turn === 0 ? true : false} />
                <div id="reversi-info-middle">
                    <ComputingIndicator isActive={this.props.players[this.props.turn] === 1 && this.props.animating === false} />
                    <PassIndicator in={this.state.showPass} timeout={1200} color={White} />
                </div>
                <DiscNumCounter color="white" count={this.props.whiteDiscNum} turn={this.props.turn === 1 ? true : false} />
            </div >
        )

    }

}