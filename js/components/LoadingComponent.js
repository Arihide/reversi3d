import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import DiscMeshFactory from './Object3Ds/DiscMeshFactory'
import BoardMeshFactory from './Object3Ds/BoardMeshFactory'
import { changePage } from '../actions'

@connect((store) => {
    return store
}, (dispatch) => {
    return {
        finishLoading() {
            dispatch(changePage("title"))
        }
    }
})
export default class LoadingComponent extends React.Component {

    constructor(props) {

        super(props)

    }

    componentDidMount() {

        Promise.all([        
            DiscMeshFactory.load(),
            BoardMeshFactory.load(),
        ]).then(() => {
            this.props.finishLoading()
        })

    }

    render() {

        return (
            <CSSTransition in={this.props.page === "loading"} timeout={500} classNames="reversi-loading-container" unmountOnExit>
                <div className='reversi-loading-container'>
                    <div className='reversi-loading'>
                        <p className='reversi-loading-message'>
                            {/* Loading... */}
                        </p>
                    </div>
                </div>
            </CSSTransition>
        )

    }

}