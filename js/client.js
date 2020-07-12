import 'scss/index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from "react-redux"

import store from './store'

import TitleComponent from './components/TitleComponent'
import ResultComponent from './components/ResultComponent'
import CanvasComponent from './components/CanvasComponent'
import Info from './components/Info'
import Menubar from './components/Menubar'
import LoadingComponent from './components/LoadingComponent'

class ReversiApp extends React.Component {

    render() {
        return (
            <div id="reversi-root">
                <LoadingComponent />
                <Info />
                <CanvasComponent />
                <TitleComponent />
                <ResultComponent />
                <Menubar />
            </div>
        )

    }

}

ReactDOM.render(
    <Provider store={store}>
        <ReversiApp />
    </Provider>,
    document.getElementById('reversi-container')
)

