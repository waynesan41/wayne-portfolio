import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'

class EducationPage {
  moneyModel: THREE.Mesh | undefined
  homeModel: THREE.Mesh | undefined
  degreeModel: THREE.Mesh | undefined
  schoolModel: THREE.Mesh | undefined

  coinModel: THREE.Mesh | undefined
  dollarModel: THREE.Mesh | undefined
  instancedCoin: THREE.InstancedMesh | undefined
  instancedDollar: THREE.InstancedMesh | undefined

  clickables: Clickable[] = [] // used in the raycaster intersects methods

  scene: THREE.Scene
  systemGroup: THREE.Group = new THREE.Group()
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 9, z: -10 },
    ctl: { x: 0, y: 3, z: 0 },
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene
    // this.scene.background = new THREE.Color(0x95a5a6)
    // this.loadFile()

    // loader.load('./models/HomeSection3.glb', (gltf) => {
    //   return gltf
    // })

    // await this.loadFile()
  }

  async loadFile(loader: GLTFLoader) {
    this.gltf = await loader.loadAsync(
      './models/compress/Education.glb',
      (gltf) => {
        // console.log(gltf)
        return gltf
      }
    )
    this.gltf.scene.position.y = -120
    // this.gltf.scene.rotation.y = 0
    // this.gltf.scene.scale.set(11, 11, 11)
    this.gltf.scene.scale.set(0.2, 0.2, 0.2)
    this.scene.add(this.gltf.scene)

    this.moneyModel = this.gltf.scene.getObjectByName('Money') as THREE.Mesh
    this.homeModel = this.gltf.scene.getObjectByName('House') as THREE.Mesh
    this.degreeModel = this.gltf.scene.getObjectByName('Degree') as THREE.Mesh
    this.schoolModel = this.gltf.scene.getObjectByName('School') as THREE.Mesh
    this.coinModel = this.gltf.scene.getObjectByName('Coin')
      .children[0] as THREE.Mesh
    this.dollarModel = this.gltf.scene.getObjectByName('Coin')
      .children[1] as THREE.Mesh

    this.systemGroup.add(this.moneyModel)
    this.systemGroup.add(this.homeModel)
    this.systemGroup.add(this.degreeModel)

    this.gltf.scene.add(this.systemGroup)

    const matrixCoin = new THREE.Matrix4()
    const matrixDollar = new THREE.Matrix4()
    const count = 9

    // const coinGeometry = this.coinModel.clone()
    console.log(this.coinModel)
    console.log(this.coinModel.position)
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    const size = 0.0022
    const coinGeometry = this.coinModel.geometry.scale(size, size, size).clone()
    const coinMaterial = this.coinModel.material

    this.instancedCoin = new THREE.InstancedMesh(
      coinGeometry,
      coinMaterial,
      count
    )
    const dollarGeometry = this.dollarModel.geometry
      .scale(size, size, size)
      .clone()
    const dolarMaterial = this.dollarModel.material

    this.instancedDollar = new THREE.InstancedMesh(
      dollarGeometry,
      dolarMaterial,
      count
    )

    // const vector3Pos = this.coinModel.children[0].position as THREE.Vector3

    this.coinModel.getWorldPosition(this.coinModel.position)
    this.dollarModel.getWorldPosition(this.dollarModel.position)
    console.log(this.coinModel.position)
    console.log(this.dollarModel.position)
    const vector3Coin = this.coinModel.position as THREE.Vector3
    const vector3Dollar = this.dollarModel.position as THREE.Vector3
    // vector3Coin.y += 0
    vector3Dollar.y += 0.2
    matrixCoin.setPosition(vector3Coin)
    // matrixCoin.makeRotationY(Math.PI / 2)
    matrixCoin.makeRotationX(Math.PI)
    matrixDollar.setPosition(vector3Dollar)
    matrixDollar.makeRotationY(Math.PI)
    let i = 0

    for (let z = 0; z < count; z++) {
      const zGap = z * 1
      matrixCoin.setPosition(vector3Coin.x, vector3Coin.y, vector3Coin.z - zGap)
      this.instancedCoin.setMatrixAt(i, matrixCoin)
      matrixDollar.setPosition(
        vector3Dollar.x,
        vector3Dollar.y,
        vector3Dollar.z - zGap
      )
      this.instancedDollar.setMatrixAt(i, matrixDollar)
      i++
    }
    this.scene.add(this.instancedCoin)
    this.scene.add(this.instancedDollar)
    // this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh
    // this.degreeModel!.setRotationFromAxisAngle(this.schoolModel!.position, 1)

    console.log(this.schoolModel)
  }
  animation(delta: number, time: number) {
    this.systemGroup.rotation.y += delta * 0.3
    this.moneyModel!.rotation.z -= delta * 0.5
    this.homeModel!.rotation.y -= delta * 0.5
    this.degreeModel!.rotation.y -= delta * 0.5
    /* this.nodejsModel!.rotation.z = Math.cos(time) * 0.5
    this.nodejsModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.nodejsModel!.rotation.y = Math.cos(time) * 0.2 */
  }
}

export default EducationPage
