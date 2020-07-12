import { BufferGeometryLoader, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, BufferAttribute, VertexColors, NeverDepth } from 'three'

import BoardMesh from './BoardMesh'
import BoardJSONPath from 'assets/board.json'

let promise

export default class BoardMeshFactory {

    static async load() {

        if (promise) return promise

        return promise = new Promise(function (resolve, reject) {

            let loader = new BufferGeometryLoader()
            loader.load(BoardJSONPath, (geo, mat) => {
                geo.clearGroups()
                geo.addGroup(0, 384, 0)     //squares
                geo.addGroup(384, 1350, 1)  //lines
                geo.addGroup(1734, 1752, 2)  //frame

                // 盤は常に最後の描画されるものとして深度を固定
                mat = [
                    new MeshLambertMaterial({ color: 0xffffff, vertexColors: VertexColors, depthFunc: NeverDepth, depthWrite: false, }),
                    new MeshBasicMaterial({ color: 0x050505, depthFunc: NeverDepth, depthWrite: false, }),
                    new MeshPhongMaterial({ color: 0x864815, shininess: 80, specular: 0xaaaaaa, depthFunc: NeverDepth, depthWrite: false, })
                ]

                let boardMesh = new BoardMesh(geo, mat)

                let colors = new Float32Array(256 * 3)

                for (let i = 0, l = 256 * 3; i < l; i += 3) {

                    colors[i] = 0.08627450980392157
                    colors[i + 1] = 0.48627450980392156
                    colors[i + 2] = 0.32941176470588235

                }

                geo.setAttribute('color', new BufferAttribute(colors, 3))

                boardMesh.receiveShadow = true
                boardMesh.matrixAutoUpdate = false
                boardMesh.name = "board"

                resolve(boardMesh)
            })

        })

    }

    static async getBoardMesh() {

        if (promise) {

            return promise

        }

        return BoardMeshFactory.load()

    }
}