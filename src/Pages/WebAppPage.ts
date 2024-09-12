import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { CamCtlPosition } from '../class/CameraControlMove'
import WebAppClickable from '../class/WebAppClickable'
import Clickable from '../class/Clickable'
import ClickRaycast from '../class/ClickRaycast'
import { Tween } from '@tweenjs/tween.js'
import ClickInstancedRaycast from '../type/ClickInstancedRaycast'

const color = new THREE.Color()

function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}

class WebAppPage {
  reactModel: THREE.Mesh | undefined
  tailwindModel: THREE.Mesh | undefined
  mongodbModel: THREE.Mesh | undefined
  nodejsModel: THREE.Mesh | undefined
  typeScript: THREE.Mesh | undefined
  linux: THREE.Mesh | undefined
  cloudflare: THREE.Mesh | undefined
  docker: THREE.Mesh | undefined
  aws: THREE.Mesh | undefined
  // handyWeb: THREE.Mesh | undefined
  handyWeb: ClickRaycast | undefined
  handyStore: ClickRaycast | undefined
  youtube: ClickRaycast | undefined
  bookmark: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined
  instancedBook: THREE.InstancedMesh | undefined
  // instancedBook: ClickInstancedRaycast | undefined

  clickables: ClickRaycast[] = [] // used in the raycaster intersects methods
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: -2, y: 11, z: -17 },
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

    // this.handyWeb = this.gltf.scene.getObjectByName('HandyWeb') as THREE.Mesh
    this.youtube = this.gltf.scene.getObjectByName('Youtube') as ClickRaycast
    this.handyWeb = this.gltf.scene.getObjectByName('HandyWeb') as ClickRaycast
    this.handyStore = this.gltf.scene.getObjectByName(
      'ChromeWebStore'
    ) as ClickRaycast

    console.log('----------------------------')
    console.log(this.youtube)

    this.planeModel = this.gltf.scene.getObjectByName('Plane') as THREE.Mesh
    this.bookmark = this.gltf.scene.getObjectByName('Bookmark') as THREE.Mesh
    this.bookmark.getWorldPosition(this.bookmark.position)

    // Instanced of Mesh [][][][][][]
    const matrix = new THREE.Matrix4()
    // const color = new THREE.Color()
    const count = 234

    const bookGeometry = this.bookmark.geometry
      .rotateY(Math.PI / 2)
      .scale(0.7, 0.7, 0.7)
      .clone()
    const bookMaterial = this.bookmark.material

    this.instancedBook = new THREE.InstancedMesh(
      bookGeometry,
      bookMaterial,
      count
    )

    // this.instancedBook.rotation.y = Math.PI / 2
    const vector3Pos = this.bookmark.position as THREE.Vector3
    vector3Pos.z -= 1.5
    matrix.setPosition(vector3Pos)
    // matrix.setPosition(this.bookmark.position)
    let i = 0
    for (let z = 0; z < 25; z++) {
      const zGap = z * 2.5
      for (let x = 0; x < 18; x++) {
        const xGap = x * 1.8
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

    // Ray Casting Handy Website xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const handyWeb = this.handyWeb
    handyWeb.hovered = false
    handyWeb.update = (delta: number) => {
      //Hover animation
      if (handyWeb.hovered) {
        handyWeb.scale.setScalar(lerp(handyWeb.scale.x, 0.25, delta * 5))
      } else {
        handyWeb.scale.setScalar(lerp(handyWeb.scale.x, 0.13, delta * 5))
      }
    }
    handyWeb.clickObj = () => {
      window.open('https://handybookmark.com/login', '_blank')
    }
    this.clickables.push(handyWeb)

    // Ray Casting Chrome Web Store xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const handyStore = this.handyStore
    handyStore.hovered = false
    handyStore.update = (delta: number) => {
      //Hover animation
      if (handyStore.hovered) {
        handyStore.scale.setScalar(lerp(handyStore.scale.x, 0.25, delta * 5))
      } else {
        handyStore.scale.setScalar(lerp(handyStore.scale.x, 0.13, delta * 5))
      }
    }
    handyStore.clickObj = () => {
      window.open(
        'https://chromewebstore.google.com/detail/handy-bookmark/eoaminfjobnfghjcdhpcjndoakidhgod',
        '_blank'
      )
    }
    this.clickables.push(handyStore)

    // Ray Casting Youtube Video xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const youtubeOut = this.youtube.children[0] as ClickRaycast
    const youtubeIn = this.youtube.children[1] as ClickRaycast
    const youtube = this.youtube
    youtubeIn.hovered = false
    youtubeOut.hovered = false
    youtubeOut.update = (delta: number) => {
      //Hover animation
      if (youtubeOut.hovered || youtubeIn.hovered) {
        console.log('hover')
        youtube.scale.setScalar(lerp(youtube.scale.y, 0.1, delta * 5))
      } else {
        youtube.scale.setScalar(lerp(youtube.scale.y, 0.07, delta * 5))
      }
    }
    youtubeIn.update = (delta: number) => {
      //Hover animation
      /* if (youtubeIn.hovered) {
        console.log('hover')
        youtube.scale.setScalar(lerp(youtube.scale.y, 0.2, delta * 5))
      } else {
        youtube.scale.setScalar(lerp(youtube.scale.x, 0.7, delta * 5))
      } */
    }
    youtubeIn.clickObj = () => {
      window.open('https://youtu.be/s-9rdQMt6rU', '_blank')
    }
    youtubeOut.clickObj = () => {
      window.open('https://youtu.be/s-9rdQMt6rU', '_blank')
    }
    this.clickables.push(youtubeOut)
    this.clickables.push(youtubeIn)

    // Ray Casting Bookmark Instanced xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const bookmarkIcon = this.instancedBook as ClickInstancedRaycast
    bookmarkIcon.update = (instanceId: number) => {}
    bookmarkIcon.changeColor = (instanceId: number) => {
      //Hover animation
      const color = new THREE.Color()
      bookmarkIcon.getColorAt(instanceId, color)

      if (color.equals(new THREE.Color(0xffffff))) {
        bookmarkIcon.setColorAt(
          instanceId,
          color.setHex(Math.random() * 0xffffff)
        )
        bookmarkIcon.instanceColor!.needsUpdate = true
      }
    }
    bookmarkIcon.clickObj = () => {
      for (var i = 0; i < count; i++) {
        // Count
        bookmarkIcon.setColorAt(i, color.setHex(0xffffff))
      }
      bookmarkIcon.instanceColor!.needsUpdate = true
    }
    this.clickables.push(bookmarkIcon)

    this.scene.add(this.gltf.scene)
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

    // Ray casting

    this.clickables.forEach((p) => {
      p.update(delta)
    })
  }
}

export default WebAppPage
