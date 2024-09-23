import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'
import { drawIndex } from 'three/webgpu'
import ClickRaycast from '../class/ClickRaycast'

class EducationPage {
  moneyModel: THREE.Mesh | undefined
  homeModel: THREE.Mesh | undefined
  degreeModel: THREE.Mesh | undefined
  schoolModel: THREE.Mesh | undefined

  coinModel: THREE.Mesh | undefined
  dollarModel: THREE.Mesh | undefined
  instancedCoin: THREE.InstancedMesh | undefined
  instancedDollar: THREE.InstancedMesh | undefined

  clickables: ClickRaycast[] = [] // used in the raycaster intersects methods

  scene: THREE.Scene
  systemGroup: THREE.Group = new THREE.Group()
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 9, z: -14 },
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
    this.gltf.scene.position.y = -200
    // this.gltf.scene.rotation.y = 0
    // this.gltf.scene.scale.set(11, 11, 11)
    this.gltf.scene.scale.set(0.3, 0.3, 0.3)
    this.scene.add(this.gltf.scene)

    this.moneyModel = this.gltf.scene.getObjectByName('Money') as THREE.Mesh
    this.homeModel = this.gltf.scene.getObjectByName('House') as THREE.Mesh
    this.degreeModel = this.gltf.scene.getObjectByName('Degree') as THREE.Mesh
    // this.schoolModel = this.gltf.scene.getObjectByName('School') as THREE.Mesh

    this.coinModel = this.gltf.scene.getObjectByName('Coin')
      .children[0] as THREE.Mesh
    this.dollarModel = this.gltf.scene.getObjectByName('Coin')
      .children[1] as THREE.Mesh

    this.systemGroup.add(this.moneyModel)
    this.systemGroup.add(this.homeModel)
    this.systemGroup.add(this.degreeModel)

    this.gltf.scene.add(this.systemGroup)

    // const jumpCpp = this.gltf.scene.getObjectByName('JumpCpp') as ClickRaycast
    const jumpCpp = addRaycast(
      this.gltf.scene.getObjectByName('JumpCpp'),
      'https://www.cprogramming.com/c++book/'
    ) as ClickRaycast
    const blueBrown = addRaycast(
      this.gltf.scene.getObjectByName('BlueBrown'),
      'https://www.3blue1brown.com/'
    ) as ClickRaycast
    const sbcode = addRaycast(
      this.gltf.scene.getObjectByName('Sbcode'),
      'https://sbcode.net/threejs/'
    ) as ClickRaycast
    const traversyMedia = addRaycast(
      this.gltf.scene.getObjectByName('TraversyMedia'),
      'https://www.traversymedia.com/'
    ) as ClickRaycast
    const webDevSimplified = addRaycast(
      this.gltf.scene.getObjectByName('WebDevSimplified'),
      'https://courses.webdevsimplified.com/'
    ) as ClickRaycast
    const udemy = addRaycast(
      this.gltf.scene.getObjectByName('Udemy'),
      'https://www.udemy.com/user/maximilian-schwarzmuller/'
    ) as ClickRaycast
    const startCpp = addRaycast(
      this.gltf.scene.getObjectByName('Cpp'),
      'https://www.pearson.com/en-us/subject-catalog/p/starting-out-with-c-from-control-structures-to-objects/P200000007369/9780134443829'
    ) as ClickRaycast
    const linux = addRaycast(
      this.gltf.scene.getObjectByName('Linux'),
      'https://www.learnlinux.tv/'
    ) as ClickRaycast
    /* this.gltf.scene.add(
      addRaycast(jumpCpp, 'https://www.cprogramming.com/c++book/')
    ) */

    this.clickables.push(jumpCpp)
    this.clickables.push(blueBrown)
    this.clickables.push(sbcode)
    this.clickables.push(traversyMedia)
    this.clickables.push(webDevSimplified)
    this.clickables.push(udemy)
    this.clickables.push(startCpp)
    this.clickables.push(linux)

    // =========================================================================
    // ==== Coin Instaned Mesh
    // =========================================================================
    const matrixCoin = new THREE.Matrix4()
    const matrixDollar = new THREE.Matrix4()
    const count = 48

    // const coinGeometry = this.coinModel.clone()
    console.log(this.coinModel)
    console.log(this.coinModel.position)
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    const size = 0.003
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
    vector3Dollar.y += 0.3
    matrixCoin.setPosition(vector3Coin)
    matrixCoin.makeRotationY(Math.PI / 2)
    matrixCoin.makeRotationX(Math.PI)
    matrixDollar.setPosition(vector3Dollar)
    matrixDollar.makeRotationY(Math.PI)
    let i = 0

    for (let z = 0; z < 9; z++) {
      const zGap = z * 1.5
      if (z == 3) continue
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

    for (let angle = 0; angle < 2; angle += 0.05) {
      // const zGap = x * 1

      let xGap = 7.5 * Math.cos(angle * Math.PI)
      let zGap = 7.5 * Math.sin(angle * Math.PI) - 3
      // matrixCoin.makeRotationY(Math.cos(angle))
      matrixDollar.makeRotationY(Math.PI * angle)
      matrixCoin.setPosition(
        vector3Coin.x + xGap,
        vector3Coin.y,
        vector3Coin.z - zGap
      )
      matrixDollar.setPosition(
        vector3Dollar.x + xGap,
        vector3Dollar.y,
        vector3Dollar.z - zGap
      )

      this.instancedCoin.setMatrixAt(i, matrixCoin)
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

    this.clickables.forEach((p) => {
      p.update(delta)
    })
  }
}

export default EducationPage

export function addRaycast(object: ClickRaycast, url: string) {
  const x = object.scale.x
  const y = object.scale.y
  const z = object.scale.z
  // console.log(object.scale.x)
  // console.log(object.scale.y)
  // console.log(object.scale.z)

  object.hovered = false
  const speed = 10
  object.update = (delta: number) => {
    if (object.hovered) {
      object.scale.x = lerp(object.scale.x, x * 1.5, delta * speed)
      object.scale.y = lerp(object.scale.y, y * 1.5, delta * speed)
      object.scale.z = lerp(object.scale.z, z * 1.5, delta * speed)
    } else {
      object.scale.x = lerp(object.scale.x, x, delta * speed)
      object.scale.y = lerp(object.scale.y, y, delta * speed)
      object.scale.z = lerp(object.scale.z, z, delta * speed)
    }
  }
  object.clickObj = () => {
    console.log('slick')
    window.open(url, '_blank')
  }

  return object
}
function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}
