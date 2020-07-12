import React from 'react'
import { Transition } from 'react-transition-group'

const duration = 100

const defaultStyle = {
    transition: `opacity ${duration}ms ease-out`
}

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
}

export default class Fade extends React.Component {

    render() {
        return (
            <Transition
                {...this.props}

                timeout={this.props.duration}
            >
                {state => (
                    <div style={{
                        transition: `opacity ${this.props.duration}ms ease-out`,
                        ...transitionStyles[state],
                    }} >
                        {this.props.children}
                    </div>
                )}
            </Transition>
        )
    }

}