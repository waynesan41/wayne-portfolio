import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath(
//   'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
// ) // loading from a CDN
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/') // loading from a CDN
dracoLoader.setDecoderPath('jsm/libs/draco/') // loading from own webserver
dracoLoader.setDecoderConfig({ type: 'js' })

class WorkPage {
  reactModel: THREE.Mesh | undefined
  tailwindModel: THREE.Mesh | undefined
  mongodbModel: THREE.Mesh | undefined
  nodejsModel: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined
  clickables: Clickable[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 5, z: -15 },
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
    this.gltf = await loader.loadAsync('./models/compress/Work.glb', (gltf) => {
      // console.log(gltf)
      return gltf
    })
    this.gltf.scene.position.y = -90
    this.gltf.scene.rotation.y = 135
    // this.gltf.scene.scale.set(11, 11, 11)
    // this.gltf.scene.scale.set(0.1, 0.1, 0.1)
    this.gltf.scene.scale.setScalar(0.2)
    this.scene.add(this.gltf.scene)

    /*  this.reactModel = this.gltf.scene.getObjectByName('ReactJS') as THREE.Mesh
    this.tailwindModel = this.gltf.scene.getObjectByName(
      'Tailwind'
    ) as THREE.Mesh
    this.mongodbModel = this.gltf.scene.getObjectByName('MongoDB') as THREE.Mesh
    this.nodejsModel = this.gltf.scene.getObjectByName('NodeJS') as THREE.Mesh
    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh */

    // console.log(this.gltf.scene)

    /* this.gltf = await loader.loadAsync('./models/Icons.glb', (gltf) => {
      console.log(gltf)
      return gltf
    })
    this.gltf.scene.position.y = -15
    this.gltf.scene.rotation.y = 90
    this.gltf.scene.scale.set(11, 11, 11)
    this.scene.add(this.gltf.scene)

    this.reactModel = this.gltf.scene.getObjectByName('ReactJS') as THREE.Mesh
    this.tailwindModel = this.gltf.scene.getObjectByName(
      'Tailwind'
    ) as THREE.Mesh
    this.mongodbModel = this.gltf.scene.getObjectByName('MongoDB') as THREE.Mesh
    this.nodejsModel = this.gltf.scene.getObjectByName('NodeJS') as THREE.Mesh
    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh

    console.log(this.gltf.scene) */

    // const pillerClickable = new Clickable(this.pillerModel, 1)
    // const welcomeClickable = new Clickable(this.welcomeModel, 2)
    // this.scene.add(welcomeClickable)
    // this.scene.add(this.planeModel)
    // this.scene.add(pillerClickable)
    // this.clickables.push(pillerClickable)
    // this.clickables.push(welcomeClickable)
    //   this.pillerModel = home.scene.getObjectByName('Piller') as THREE.Mesh
    //   this.planeModel = home.scene.getObjectByName('Plane') as THREE.Mesh
    //   this.welcomeModel = home.scene.getObjectByName('Welcome') as THREE.Mesh
    //   const pillerClickable = new Clickable(this.pillerModel, 1)
    //   const welcomeClickable = new Clickable(this.welcomeModel, 2)
    //   this.scene.add(welcomeClickable)
    //   this.scene.add(pillerClickable)
    //   this.clickables.push(pillerClickable)
    //   this.clickables.push(welcomeClickable)
  }
  animation(delta: number, time: number) {
    this.reactModel!.rotation.y += delta
    this.tailwindModel!.rotation.x += delta
    this.mongodbModel!.rotation.z += delta

    this.nodejsModel!.rotation.z = Math.cos(time) * 0.5
    this.nodejsModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.nodejsModel!.rotation.y = Math.cos(time) * 0.2
  }
}

export default WorkPage
