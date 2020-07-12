import { Scene, AmbientLight, DirectionalLight } from 'three'

import BoardMeshFactory from './BoardMeshFactory'
import ReversiCamera from './ReversiCamera'

let directionalLight

export default class ReversiScene extends Scene {

    constructor() {
        super()
    }

    static createScene() {

        let scene = new ReversiScene()
        scene.name = "reversi"

        const ambientLight = new AmbientLight(0x888888)
        ambientLight.name = "ambientLight"
        ambientLight.position.set(0, 600, 0)
        scene.add(ambientLight)

        directionalLight = new DirectionalLight(0xffffff, 1)
        directionalLight.name = "directionalLight"
        directionalLight.position.set(-250, 250, 100)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        directionalLight.shadow.camera.left = -200
        directionalLight.shadow.camera.right = 200
        directionalLight.shadow.camera.top = 120
        directionalLight.shadow.camera.bottom = -120

        directionalLight.shadow.mapSize.width = 1024  // default
        directionalLight.shadow.mapSize.height = 1024 // default
        directionalLight.shadow.camera.near = 0.5       // default
        directionalLight.shadow.camera.far = 1000

        BoardMeshFactory.getBoardMesh().then((mesh) => {
            scene.add(mesh)
        })

        return scene

    }

}