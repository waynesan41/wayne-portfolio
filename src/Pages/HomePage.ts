import * as THREE from 'three'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

class HomePage {
  cube: THREE.Mesh | undefined
  pillerModel: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined
  welcomeModel: THREE.Mesh | undefined
  clickables: Clickable[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 0, y: 4, z: -6.5 },
    ctl: { x: 0, y: 3.5, z: 0 },
  }
  constructor(scene: THREE.Scene) {
    this.scene = scene
    // this.scene.background = new THREE.Color(0x95a5a6)
    // this.scene.backgroundRotation = new THREE.Euler(50, 10, 80, 'XYZ')
    // this.loadFile()

    // loader.load('./models/HomeSection3.glb', (gltf) => {
    //   return gltf
    // })
    // await this.loadFile()
    /* this.upBtn = document.getElementById('up-btn') as HTMLButtonElement
    this.downBtn = document.getElementById('down-btn') as HTMLButtonElement
    this.upBtn.addEventListener('click', (e) => {
      this.goUp()
    })
    this.downBtn.addEventListener('click', (e) => {
      this.goDown()
    }) */
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
    const light = new THREE.AmbientLight(0xffffff, 3)
    this.scene.add(light)
    this.pillerModel = this.gltf.scene.getObjectByName('Piller') as THREE.Mesh
    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh
    this.welcomeModel = this.gltf.scene.getObjectByName('Welcome') as THREE.Mesh

    const pillerClickable = new Clickable(this.pillerModel, 1)
    const welcomeClickable = new Clickable(this.welcomeModel, 2)
    this.scene.add(welcomeClickable)
    this.scene.add(this.planeModel)
    this.scene.add(pillerClickable)
    this.clickables.push(pillerClickable)
    this.clickables.push(welcomeClickable)
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

    // this.cube!.rotation.x += 0.01
    // this.cube!.rotation.y += 0.01
  }
}

export default HomePage
