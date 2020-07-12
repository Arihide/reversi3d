import DiscJSONPath from 'assets/disc.json'

import { Mesh, MeshPhongMaterial, MeshLambertMaterial, BufferGeometryLoader } from 'three'

let promise

export default class DiscMeshFactory {

    static async load() {

        if (promise) return promise
        
        return promise = new Promise(function (resolve, reject) {

            let loader = new BufferGeometryLoader()

            loader.load(DiscJSONPath, (geo, mat) => {
                geo.clearGroups()
                geo.addGroup(0, 480, 0)     //black
                geo.addGroup(480, 480, 1)  //white

                mat = [
                    new MeshPhongMaterial({ color: 0x000000, shininess: 15, specular: 0x777777 }),
                    new MeshLambertMaterial({ color: 0xeeeeee })
                ]

                let discMesh = new Mesh(geo, mat)

                resolve(discMesh)

            })

        })
    }

    static async create(square, color = 0) {

        if (promise) {
            let discMesh = await promise

            let mesh = discMesh.clone()

            mesh.name = `disc${square}`
            mesh.userData = square
            mesh.castShadow = true

            if (color === 1) {
                mesh.rotation.z = Math.PI
            }

            return Promise.resolve(mesh)
        }

        return DiscMeshFactory.load().then(discMesh => {

            let mesh = discMesh.clone()

            mesh.name = `disc${square}`
            mesh.userData = square
            mesh.castShadow = true

            if (color === 1) {
                mesh.rotation.z = Math.PI
            }

            return mesh
        })

    }

}