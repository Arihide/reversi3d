import React from 'react';

import Transition from 'react-transition-group/Transition';
import 'scss/pass.scss';

const duration = 150;

const defaultStyle = {
    visibility: 'hidden'
}

const transitionStyles = {
    entering: {
        animation: duration + 'ms ease-out 0s 1 normal both running abc',
        visibility: 'visible'
    },
    entered: { visibility: 'visible' },
    exiting: {
        animation: duration + 'ms ease-in 0s 1 reverse both running abc',
        visibility: 'visible'
    },
    exited: { visibility: 'hidden' }
};

export default class PassIndicator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            in: false

        };
    }

    componentDidUpdate() {

        if (this.props.in === true) {
            this.setState({ in: true });
        }

    }

    render() {

        return (
            <Transition in={this.props.in} timeout={this.props.timeout}>
                {(state) => (
                    <div className={"pass " + (this.props.color === 0 ? "black" : "white")} style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                        pass
                    </div>
                )}
            </Transition>
        );

    }

}