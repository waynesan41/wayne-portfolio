import * as THREE from 'three'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import ClickRaycast from '../class/ClickRaycast'
import { update } from '@tweenjs/tween.js'

let clock = new THREE.Clock()

class HomePage {
  cube: THREE.Mesh | undefined
  // pillerModel: THREE.Mesh | undefined
  // welcomeModel: THREE.Mesh | undefined
  pillerModel: ClickRaycast | undefined
  welcomeModel: ClickRaycast | undefined
  planeModel: THREE.Mesh | undefined
  clickables: ClickRaycast[] = [] // used in the raycaster intersects methods

  gltf: any | undefined
  scene: THREE.Scene

  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 4, z: -6.5 },
    ctl: { x: 0, y: 3.5, z: 0 },
  }
  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  loadObjectTest() {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshNormalMaterial({ wireframe: true })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)
  }

  //   loadFile(home: any) {
  async loadFile(loader: GLTFLoader) {
    this.gltf = await loader.loadAsync(
      // './models/compress/HomeSection.glb',
      './models/compress/HomeCool.glb',
      (gltf) => {
        return gltf
      }
    )
    const light = new THREE.AmbientLight(0xffffff, 2.5)
    this.scene.add(light)

    // this.pillerModel = this.gltf.scene.getObjectByName('Piller') as THREE.Mesh
    // this.welcomeModel = this.gltf.scene.getObjectByName('Welcome') as THREE.Mesh
    this.pillerModel = this.gltf.scene.getObjectByName('Piller') as ClickRaycast
    this.welcomeModel = this.gltf.scene.getObjectByName(
      'Welcome'
    ) as ClickRaycast
    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh

    // const pillerClickable = new Clickable(this.pillerModel, 1)
    // const welcomeClickable = new Clickable(this.welcomeModel, 2)
    // this.scene.add(welcomeClickable)
    // this.scene.add(this.planeModel)
    // this.scene.add(pillerClickable)

    // setUpPiller(this.pillerModel)
    /* this.pillerModel.direction = 2
    this.pillerModel.update = (delta) => {
      this.pillerModel!.position.y = this.pillerModel!.y + Math.cos(time) * 0.1
      // piller.rotation.x += delta / 2
      // piller.clicked ? piller.scale.setScalar(2) : piller.scale.setScalar(1)
      if (this.pillerModel!.direction === 0) {
        this.pillerModel!.rotation.y -= delta / 2
      } else if (this.pillerModel!.direction === 2) {
        this.pillerModel!.rotation.y += delta / 2
      }
    } */
    const piller = this.pillerModel
    piller!.direction = 2
    piller.update = (delta: number) => {
      const time = clock.getElapsedTime()
      // this.pillerModel!.position.y = piller!.position.y + Math.cos(time) * 0.1
      piller!.position.y = Math.cos(time) * 0.1 + 4

      if (piller!.direction === 0) {
        piller!.rotation.y -= delta / 2
      } else if (piller!.direction === 2) {
        piller!.rotation.y += delta / 2
      }
    }
    piller.clickObj = () => {
      console.log('Clicked')
      console.log(piller!.direction)
      if (piller!.direction === 3) {
        piller!.direction = 0
      } else {
        piller!.direction++
      }
    }
    this.gltf.scene.remove(piller)
    this.scene.add(piller)
    this.clickables.push(piller)
    this.scene.add(this.gltf.scene)

    /* this.pillerModel!.direction = 2
    this.pillerModel.update = (delta: number) => {
      const time = clock.getElapsedTime()
      console.log(this.pillerModel!.y)
      // this.pillerModel!.position.y = this.pillerModel!.y + Math.cos(time) * 0.1
      this.pillerModel!.position.y = Math.cos(time) * 0.1 + 4
      if (this.pillerModel!.direction === 0) {
        this.pillerModel!.rotation.y -= delta / 2
      } else if (this.pillerModel!.direction === 2) {
        this.pillerModel!.rotation.y += delta / 2
      }
    }
    this.pillerModel.onClick = () => {
      if (this.pillerModel!.direction === 3) {
        this.pillerModel!.direction = 0
      } else {
        this.pillerModel!.direction++
      }
    }
    this.clickables.push(this.pillerModel) */

    // this.clickables.push(this.welcomeModel)
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

  animation(delta: number) {
    this.clickables.forEach((p) => {
      p.update(delta)
    })
    // const intersects = raycaster.intersectObject(this.localClick, false)
    // raycaster.setFromCamera(this.mouse, this.camera)

    // intersects = raycaster.intersectObjects(pickables, false)

    // console.log(intersects)
    // this.cube!.rotation.x += 0.01
    // this.cube!.rotation.y += 0.01
  }
}

export default HomePage

/* function setUpPiller(piller: ClickRaycast) {
  const time = clock.getElapsedTime()
  piller.direction = 2
  piller.update = (delta) => {
    piller.position.y = piller.y + Math.cos(time) * 0.1
    // piller.rotation.x += delta / 2
    // piller.clicked ? piller.scale.setScalar(2) : piller.scale.setScalar(1)
    if (piller.direction === 0) {
      piller.rotation.y -= delta / 2
    } else if (piller.direction === 2) {
      piller.rotation.y += delta / 2
    }
  }
}
 */
