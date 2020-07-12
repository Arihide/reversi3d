import React from 'react';

import 'scss/loading.scss';

export default class ComputingIndicator extends React.Component {

    constructor(props) {

        super(props);

    }

    render() {

        return (
            <div className="loading-container" style={{ display: this.props.isActive === true ? "block" : "none" }}>
                <div className="loading"></div>
                <div id="loading-text">Computer<br />Thinking</div>
            </div>
        );

    }

}