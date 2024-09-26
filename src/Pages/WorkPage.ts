import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { CamCtlPosition } from '../class/CameraControlMove'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { addRaycast, changePercent } from '../class/GlobalHelperFunction'
import ClickRaycast from '../class/ClickRaycast'

const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('jsm/libs/draco/') // loading from own webserver
dracoLoader.setDecoderConfig({ type: 'js' })

class WorkPage {
  arrowModel: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined
  clickables: ClickRaycast[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 5, z: -15 },
    ctl: { x: 0, y: 4, z: 0 },
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  async loadFile(loader: GLTFLoader) {
    this.gltf = await loader.loadAsync('./models/compress/Work.glb', (gltf) => {
      // console.log(gltf)
      changePercent(gltf.loaded, gltf.total, 5, 64)
      // const percentComplete = (gltf.loaded / gltf.total) * 20 + 68
      // percent!.innerText = percentComplete.toString()
      return gltf
    })

    this.gltf.scene.position.y = -150
    this.gltf.scene.rotation.y = 135
    // this.gltf.scene.scale.set(11, 11, 11)
    // this.gltf.scene.scale.set(0.1, 0.1, 0.1)
    this.gltf.scene.scale.setScalar(1.7)

    this.arrowModel = this.gltf.scene.getObjectByName('Arrow') as THREE.Mesh
    this.gltf.scene.remove(this.arrowModel)

    this.planeModel = this.gltf.scene.getObjectByName('Egg') as THREE.Mesh

    const logistics = addRaycast(
      this.gltf.scene.getObjectByName('717'),
      'https://www.udemy.com/user/maximilian-schwarzmuller/'
    ) as ClickRaycast

    logistics.clickObj = () => {
      // Open Dialog
      const dialog717 = document.getElementById(
        'workDialog'
      ) as HTMLDialogElement
      dialog717.showModal()
    }

    this.clickables.push(logistics)

    this.scene.add(this.gltf.scene)
  }
  animation(delta: number, time: number) {
    // this.reactModel!.rotation.y += delta
    // this.tailwindModel!.rotation.x += delta
    // this.mongodbModel!.rotation.z += delta
    // this.nodejsModel!.rotation.z = Math.cos(time) * 0.5
    // this.nodejsModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    // this.nodejsModel!.rotation.y = Math.cos(time) * 0.2

    this.clickables.forEach((p) => {
      p.update(delta)
    })
  }
}

export default WorkPage
