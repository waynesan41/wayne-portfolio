import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Clickable from '../class/Clickable'
import { CamCtlPosition } from '../class/CameraControlMove'
import { vertexColor } from 'three/webgpu'

class WebAppPage {
  reactModel: THREE.Mesh | undefined
  tailwindModel: THREE.Mesh | undefined
  mongodbModel: THREE.Mesh | undefined
  nodejsModel: THREE.Mesh | undefined
  typeScript: THREE.Mesh | undefined
  linux: THREE.Mesh | undefined
  cloudflare: THREE.Mesh | undefined
  docker: THREE.Mesh | undefined
  youtube: THREE.Mesh | undefined
  aws: THREE.Mesh | undefined
  handyWeb: THREE.Mesh | undefined
  handStore: THREE.Mesh | undefined
  bookmark: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined
  instancedBook: THREE.InstancedMesh | undefined

  clickables: Clickable[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: -2, y: 7, z: -16 },
    ctl: { x: -2, y: 7, z: 0 },
  }
  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  async loadFile(loader: GLTFLoader) {
    this.gltf = await loader.loadAsync(
      './models/compress/Icons.glb',
      (gltf) => {
        // console.log(gltf)
        return gltf
      }
    )
    this.gltf.scene.position.y = -30
    // this.gltf.scene.rotation.y = 135
    this.gltf.scene.scale.set(9, 9, 9)
    // this.scene.add(this.gltf.scene) // This is now added later
    this.scene.add(this.gltf.scene)

    this.reactModel = this.gltf.scene.getObjectByName('ReactJS') as THREE.Mesh
    this.tailwindModel = this.gltf.scene.getObjectByName(
      'Tailwind'
    ) as THREE.Mesh
    this.mongodbModel = this.gltf.scene.getObjectByName('MongoDB') as THREE.Mesh
    this.nodejsModel = this.gltf.scene.getObjectByName('NodeJS') as THREE.Mesh
    this.typeScript = this.gltf.scene.getObjectByName(
      'TypeScript'
    ) as THREE.Mesh
    this.docker = this.gltf.scene.getObjectByName('Docker') as THREE.Mesh
    this.aws = this.gltf.scene.getObjectByName('AWS') as THREE.Mesh
    this.linux = this.gltf.scene.getObjectByName('Linux') as THREE.Mesh
    this.cloudflare = this.gltf.scene.getObjectByName(
      'Cloudflare'
    ) as THREE.Mesh

    this.handyWeb = this.gltf.scene.getObjectByName('HandyWeb') as THREE.Mesh
    this.handStore = this.gltf.scene.getObjectByName(
      'ChromeWebStore'
    ) as THREE.Mesh

    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh
    this.bookmark = this.gltf.scene.getObjectByName('Bookmark') as THREE.Mesh
    this.bookmark.getWorldPosition(this.bookmark.position)

    console.log('----------------------------')

    // Instanced of Mesh [][][][][][]
    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()
    const count = 88

    const bookGeometry = this.bookmark.geometry
      .rotateY(Math.PI / 2)
      // .scale(0.7, 0.7, 0.7)
      .clone()
    const bookMaterial = this.bookmark.material

    this.instancedBook = new THREE.InstancedMesh(
      bookGeometry,
      bookMaterial,
      count
    )
    /* this.instancedBook = new THREE.InstancedMesh(
      this.bookmark.geometry.rotateY(Math.PI / 2).clone(),
      this.bookmark.material,
      count
    ) */
    // this.instancedBook.rotation.y = Math.PI / 2
    const vector3Pos = this.bookmark.position as THREE.Vector3
    vector3Pos.z -= 1.5
    matrix.setPosition(vector3Pos)
    // matrix.setPosition(this.bookmark.position)
    let i = 0
    for (let z = 0; z < 8; z++) {
      const zGap = z * 4
      for (let x = 0; x < 11; x++) {
        const xGap = x * 3
        matrix.setPosition(
          vector3Pos.x - xGap,
          vector3Pos.y,
          vector3Pos.z - zGap
        )
        this.instancedBook.setMatrixAt(i, matrix)
        this.instancedBook.setColorAt(i, color.setHex(0xffffff))
        // this.instancedBook.setColorAt(i, color.setHex(Math.random() * 0xffffff))
        i++
      }
    }

    this.scene.add(this.instancedBook)
  }
  animation(delta: number, time: number) {
    this.reactModel!.rotation.z += delta * 0.7
    this.tailwindModel!.rotation.x += delta * 0.7
    this.typeScript!.rotation.z += delta * 0.7

    // this.nodejsModel!.rotation.z = Math.cos(time) * 0.2
    this.nodejsModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    // this.nodejsModel!.rotation.y = Math.cos(time) * 0.2

    // this.mongodbModel!.rotation.z = Math.cos(time) * 0.2
    this.mongodbModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    // this.mongodbModel!.rotation.y = Math.cos(time) * 0.2

    this.cloudflare!.rotation.x = Math.sin(time) * 0.4 + 1.5

    this.aws!.rotation.y = Math.cos(time) * 0.4
    this.docker!.rotation.z = -Math.cos(time) * 0.4 - Math.PI

    this.linux!.rotation.y += delta * 0.7
  }
}

export default WebAppPage
