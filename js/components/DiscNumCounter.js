import React from 'react';

export default class DiscNumCounter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div style={{ borderColor: (this.props.turn ? "#ff0" : "#fff")}} id="reversi-info-black">
                <div className={"circle-container"}>
                    <div className={"circle-" + this.props.color}></div>
                </div>
                <div style={{ margin: "0 auto" }} className={"disc-num-" + this.props.color}>{this.props.count}</div>
            </div>
        );

    }

}