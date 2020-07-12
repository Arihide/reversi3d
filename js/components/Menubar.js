import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import Fade from './Fade'

import { startGame, toggleAnimation, changePage, changeQuality, undoMove } from '../actions'

import 'scss/menubar.scss'
import 'scss/setting.scss'

// import UndoIcon from '../../assets/icon.svg'
// import RestartIcon from '../../assets/restart.svg'
// import SettingIcon from '../../assets/setting.svg'

import '../../assets/fonts/icomoon.eot'
// import '../../assets/fonts/icomoon.svg'
import '../../assets/fonts/icomoon.ttf'
import '../../assets/fonts/icomoon.woff'

@connect((store) => {
    return store;
}, (dispatch) => {
    return {
        handleUndo() {
            dispatch(undo());
        },

        startGame(state) {
            dispatch(startGame(state));
        },

        toggleAnimation() {
            dispatch(toggleAnimation(!this.props.settings.animationEnabled));
        },

        changeQuality(qualityLevel) {
            dispatch(changeQuality(qualityLevel))
        },

        undoMove() {
            dispatch(undoMove(this.props))
        },

        changeTitlePage() {
            this.closeSettings()
            dispatch(changePage("title"))
        },

    }
})
export default class Menubar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSettingsOpen: false,
            isBackToTitleOpen: false,
            openedSettingIndex: 1,
        }

    }

    toggleSettings() {
        this.setState({ isSettingsOpen: !this.state.isSettingsOpen });
    }

    closeSettings() {
        this.setState({ isSettingsOpen: false, isBackToTitleOpen: false });
    }

    toggleSettingDetail(index = 0) {
        this.setState({
            isBackToTitleOpen: !this.state.isBackToTitleOpen,
            openedSettingIndex: index,
        });
    }

    closeSettingDetail() {
        this.setState({
            isBackToTitleOpen: false
        });
    }

    render() {

        if (this.props.page !== "game") {
            return (
                <div id="reversi-menubar" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}></div>
            )
        }

        return (
            <div id="reversi-menubar">

                <Fade in={this.state.isSettingsOpen} duration={150} mountOnEnter unmountOnExit >
                    <div className="overlay" onClick={this.closeSettings.bind(this)}>
                        <div className="setting-container" onClick={e => e.stopPropagation()}>
                            <div className="setting-close-button" onClick={this.closeSettings.bind(this)}>×</div>
                            <CSSTransition in={!this.state.isBackToTitleOpen} classNames="page" timeout={300}>
                                <div className="page">
                                    <div className="setting" style={{ transitionDuration: 300 }} onClick={e => e.stopPropagation()} >
                                        <div className="setting-item" onClick={e => this.toggleSettingDetail(1)}>
                                            <label>品質</label>
                                            <div>
                                                {this.props.settings.quality === 1 ? "中　" : this.props.settings.quality === 2 ? "高　" : "　"}<span className="icon-arrow-right2"></span>
                                            </div>
                                            {this.state.openedSettingIndex === 1 &&
                                                <div className="setting-next setting" style={{ transitionDuration: 300, }} onClick={(e) => { e.stopPropagation() }} >
                                                    <div className="setting-back" onClick={e => this.closeSettingDetail()}>
                                                        <span className="icon-arrow-left2"></span>  品質
                                                    </div>
                                                    <label htmlFor="low" className="setting-item">
                                                        <input type="radio" value="low" id="low" checked={this.props.settings.quality === 1} onChange={this.props.changeQuality.bind(this, 1)} />
                                                        <div>中</div>
                                                        <span className="icon-checkmark"></span>
                                                    </label>
                                                    <label htmlFor="high" className="setting-item">
                                                        <input type="radio" value="high" id="high" checked={this.props.settings.quality === 2} onChange={this.props.changeQuality.bind(this, 2)} />
                                                        <div>高</div>
                                                        <span className="icon-checkmark"></span>
                                                    </label>
                                                </div>
                                            }
                                        </div>
                                        <div className="setting-item">
                                            <label>アニメーション</label>
                                            <input type="checkbox" onChange={this.props.toggleAnimation.bind(this)} checked={this.props.settings.animationEnabled} />
                                        </div>
                                        <div className="setting-item" onClick={() => { this.closeSettings(); this.props.undoMove.apply(this) }}>
                                            <label>一手戻す</label>
                                        </div>
                                        <div className="setting-item" onClick={e => this.toggleSettingDetail(4)}>
                                            <label>タイトルに戻る</label>
                                            <div className="icon-arrow-right2" ></div>
                                            {this.state.openedSettingIndex === 4 &&
                                                <div className="setting-next" style={{ transitionDuration: 300, }} onClick={(e) => { e.stopPropagation() }} >
                                                    <div className="setting-back" onClick={e => this.closeSettingDetail()}>
                                                        <span className="icon-arrow-left2"></span>  タイトルに戻る
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                                                        <h3>タイトルに戻りますか？</h3>
                                                        <button className="reversi-button" style={{ width: "60%" }} onClick={this.props.changeTitlePage.bind(this)}>はい</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                    </div>
                </Fade>

                <div style={{ flexBasis: "100%", textAlign: "center", }} onClick={this.toggleSettings.bind(this)}>
                    <div className="icon-cog" style={{ fontSize: 30 }}></div>
                </div>

            </div >
        );
    }

}