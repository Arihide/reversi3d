import { Box3, Vector3, Spherical } from 'three'

Object.assign(Box3.prototype, {
    project: function () {
        var points = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3()
        ]

        return function (camera) {
            // transform of empty box is an empty box.
            if (this.isEmpty()) return this

            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            points[0].set(this.min.x, this.min.y, this.min.z).project(camera) // 000
            points[1].set(this.min.x, this.min.y, this.max.z).project(camera) // 001
            points[2].set(this.min.x, this.max.y, this.min.z).project(camera) // 010
            points[3].set(this.min.x, this.max.y, this.max.z).project(camera) // 011
            points[4].set(this.max.x, this.min.y, this.min.z).project(camera) // 100
            points[5].set(this.max.x, this.min.y, this.max.z).project(camera) // 101
            points[6].set(this.max.x, this.max.y, this.min.z).project(camera) // 110
            points[7].set(this.max.x, this.max.y, this.max.z).project(camera) // 111

            this.setFromPoints(points)

            return this
        }
    }()
})

// targetBoxが収まるようにカメラの奥行きを調整するクラス
export default class CameraFitter {

    constructor(camera) {

        this.camera = camera

        this._targetBox = new Box3() // 画面に収めるべき領域
        this._targetCenter = new Vector3() // その領域の中心

        // 最終的にtargetCenterから見たカメラ位置が格納される。
        // 球座標系だと radius だけの変更で済むので計算が楽
        this.spherical = new Spherical()

    }

    set targetBox(value) {

        this._targetBox = value
        this._targetBox.getCenter(this._targetCenter)

    }

    fitCamera() {

        const targetToCamera = new Vector3()
        const nearestPoint = new Vector3()
        const tempTargetBox = new Box3()

        this.camera.lookAt(this._targetCenter)

        // オブジェクトからカメラへのベクトル
        this.spherical.setFromCartesianCoords(
            this.camera.position.x - this._targetCenter.x,
            this.camera.position.y - this._targetCenter.y,
            this.camera.position.z - this._targetCenter.z,
        )

        tempTargetBox.copy(this._targetBox)

        // 直方体からカメラに向かう単位ベクトルを求める
        targetToCamera.subVectors(this.camera.position, this._targetCenter).normalize()

        //「今一番カメラに近い直方体の角」を求める
        nearestPoint.set(
            targetToCamera.x > 0 ? tempTargetBox.max.x : tempTargetBox.min.x,
            targetToCamera.y > 0 ? tempTargetBox.max.y : tempTargetBox.min.y,
            targetToCamera.z > 0 ? tempTargetBox.max.z : tempTargetBox.min.z,
        )

        // targetCenter を基準の座標にする
        nearestPoint.sub(this._targetCenter)

        //単位ベクトルの軸上で、最もカメラに近い座標を計算する
        nearestPoint.projectOnVector(targetToCamera)

        //最も近い角が「原点を通るスクリーンに平行な面」に来るように移動する
        tempTargetBox.min.sub(nearestPoint)
        tempTargetBox.max.sub(nearestPoint)

        //領域をクリップ座標に変換
        tempTargetBox.project(this.camera)

        //最もスクリーンの端に近い点を求める（tempBoxはクリップ座標系であることに注意)
        var scale = Math.max(tempTargetBox.max.x, tempTargetBox.max.y, -tempTargetBox.min.x, -tempTargetBox.min.y)

        // 結果を格納
        this.spherical.radius = (this.spherical.radius * scale) + nearestPoint.length()

        // 球座標から元に戻す
        this.camera.position
            .setFromSpherical(this.spherical)
            .add(this._targetCenter)

    }

}