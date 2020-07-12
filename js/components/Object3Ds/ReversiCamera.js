import { PerspectiveCamera, Raycaster, Vector3, Box3 } from 'three'

import CameraFitter from './CameraFitter'
import BoardMeshFactory from './BoardMeshFactory'

export default class ReversiCamera extends PerspectiveCamera {

    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far)

        this.raycaster = new Raycaster()

        this._controls = new CameraFitter(this)
        this.targets

        this._controls.targetBox = new Box3(new Vector3(-166, 0, -182), new Vector3(166, 0, 182))

        this.position.set(0, 4, 1)
        this.lookAt(0, 0, 0)
        this.update()

        // クリック判定があるのは盤だけ
        BoardMeshFactory.getBoardMesh().then((mesh) => {

            this.targets = mesh

        })

    }

    pick(vector2) {

        if (this.targets === undefined) return null

        this.raycaster.setFromCamera(vector2, this)

        let intersects
        if (Array.isArray(this.targets)) {
            intersects = this.raycaster.intersectObjects(this.targets, false)
        } else {
            intersects = this.raycaster.intersectObject(this.targets, false)
        }

        if (intersects.length > 0) {
            return intersects[0]
        }

        return null

    }

    update() {

        this._controls.fitCamera()

    }

}