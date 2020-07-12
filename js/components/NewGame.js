import React from 'react'
import Fade from './Fade'

export default class NewGame extends React.Component {

    constructor(props) {

        super(props)

        this.state = {

            in: true,

            num: 1,
            color: "b",
            level: 1

        }

    }

    toggle() {
        this.setState({
            in: !this.state.in
        })
    }

    render() {

        return (
            <Fade in={this.state.in} duration={100} onExited={this.props.onRequestNewGame.bind(this, this.state)}>
                <div id="reversi-menu" className="popup" onClick={(e) => { e.stopPropagation() }}>
                    <h2>Reversi 3D</h2>
                    <div id="reversi-menu-playerNum" className="reversi-menu-item">
                        <input type="radio" value="one" id="one" name="num" checked={this.state.num === 1}
                            onChange={() => this.setState({ num: 1 })} />
                        <label htmlFor="one">1 Player</label>
                        <input type="radio" value="two" id="two" name="num" checked={this.state.num === 2}
                            onChange={() => this.setState({ num: 2 })} />
                        <label htmlFor="two">2 Players</label>
                    </div>

                    {/* <button type="submit" className="reversi-button reversi-play-button" onClick={this.props.onRequestNewGame.bind(this, this.state)}>Play</button> */}
                    <button type="submit" className="reversi-button reversi-play-button" onClick={() => this.toggle()}>Play</button>
                </div>
            </Fade>
        )
    }



}