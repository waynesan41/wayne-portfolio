import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'

class AndroidPage {
  dartModel: THREE.Mesh | undefined
  flutterModel: THREE.Mesh | undefined
  kotlinModel: THREE.Mesh | undefined
  javaModel: THREE.Mesh | undefined
  appModel: THREE.Mesh | undefined
  phoneModel: THREE.Mesh | undefined
  android: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined

  clickables: Clickable[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 1, y: 10, z: -25 },
    ctl: { x: 0, y: 4, z: 0 },
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
      './models/compress/Android.glb',
      (gltf) => {
        // console.log(gltf)
        return gltf
      }
    )
    this.gltf.scene.position.y = -100
    this.gltf.scene.rotation.y = Math.PI
    const sceneScale = 7.3
    this.gltf.scene.scale.set(sceneScale, sceneScale, sceneScale)
    this.scene.add(this.gltf.scene)

    // Model Assignment
  }
  animation(delta: number, time: number) {
    this.dartModel!.rotation.y += delta
    this.flutterModel!.rotation.x += delta
    this.kotlinModel!.rotation.z += delta
    this.javaModel!.rotation.z += delta

    this.phoneModel!.rotation.z = Math.cos(time) * 0.5
  }
}

export default AndroidPage
