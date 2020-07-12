import React from 'react'
import { connect } from 'react-redux'

import ReversiScene from './Object3Ds/ReversiScene'
import ReversiCamera from './Object3Ds/ReversiCamera'

import { WebGLRenderer, Vector2, TOUCH } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@connect((store) => {
    return store
})
export default class CanvasComponent extends React.Component {

    constructor(props) {

        super(props)

    }

    componentDidMount() {

        this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas })

        this.setQuality(this.props.settings.quality)

        this.renderer.shadowMap.enabled = true

        this.scene = ReversiScene.createScene()
        this.camera = new ReversiCamera(38, this.canvas.clientWidth / this.canvas.clientHeight, 100, 1000)

        // this.controls = new OrbitControls(this.camera, this.canvas)
        // this.controls.touches = {
        //     TWO: TOUCH.DOLLY_ROTATE,
        // }

        // デバッグ用
        process.env.NODE_ENV === "development" && document.addEventListener('keydown', event => {

            if (event.key === "s") {

                const textarea = document.createElement("textarea")
                textarea.setAttribute("style", "position:absolute; top:-1000px;") 
                textarea.innerHTML = JSON.stringify(this.scene.toJSON())

                document.body.appendChild(textarea)
                textarea.select()

                document.execCommand("copy")

            }

        })

        this._animate()

        window.addEventListener('resize', this.onWindowResize.bind(this))

    }

    componentDidUpdate(prevProps) {
        this.setQuality(this.props.settings.quality)
    }

    shouldComponentUpdate(nextProps) {
        return this.props.settings.quality !== nextProps.settings.quality
    }

    _animate() {

        requestAnimationFrame(() => this._animate())

        // this.controls.update()

        this.renderer.render(this.scene, this.camera)
    }

    setQuality(level) {

        const scale = level == 1 ? 1 : devicePixelRatio
        this.renderer.setSize(this.canvas.clientWidth * scale, this.canvas.clientHeight * scale)

    }

    onClick(e) {

        e.preventDefault()
        e.stopPropagation()

        let mouse = new Vector2()
        mouse.x = (e.nativeEvent.offsetX / this.canvas.clientWidth) * 2 - 1
        mouse.y = -(e.nativeEvent.offsetY / this.canvas.clientHeight) * 2 + 1

        let intersection = this.camera.pick(mouse)
        if (intersection !== null) {
            intersection.object.onClick(intersection)
        }

    }

    render() {
        return (
            <canvas id="reversi-canvas" ref={(canvas) => this.canvas = canvas} onClick={this.onClick.bind(this)}></canvas>
        )
    }

    onWindowResize() {

        const width = this.renderer.domElement.clientWidth
        const height = this.renderer.domElement.clientHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.camera.update()

        this.renderer.setSize(width, height)

    }

}