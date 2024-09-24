import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { CamCtlPosition } from '../class/CameraControlMove'

import ClickRaycast from '../class/ClickRaycast'
import ClickInstancedRaycast from '../type/ClickInstancedRaycast'
import { addRaycast } from './EducationPage'
import { changePercent } from '../class/GlobalHelperFunction'

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
      './models/compress/WebApp.glb',
      (gltf) => {
        // console.log(gltf)
        changePercent(gltf.loaded, gltf.total, 21, 27)

        // const percentComplete = (gltf.loaded / gltf.total) * 20 + 27
        // percent!.innerText = percentComplete.toString()
        return gltf
      }
    )
    this.gltf.scene.position.y = -50
    // this.gltf.scene.rotation.y = 135
    this.gltf.scene.scale.set(8, 8, 8)
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

    // const youtubeModel = this.gltf.scene.getObjectByName('Youtube') as ClickRaycast

    this.youtube = this.gltf.scene.getObjectByName('Youtube') as ClickRaycast

    const handyWebModel = addRaycast(
      this.gltf.scene.getObjectByName('HandyWeb'),
      'https://handybookmark.com/login'
    ) as ClickRaycast
    const handyStoreModel = addRaycast(
      this.gltf.scene.getObjectByName('ChromeWebStore'),
      'https://chromewebstore.google.com/detail/handy-bookmark/eoaminfjobnfghjcdhpcjndoakidhgod'
    ) as ClickRaycast
    const lightSS = addRaycast(
      this.gltf.scene.getObjectByName('Light'),
      'https://handybookmark.com/login'
    ) as ClickRaycast
    const darkSS = addRaycast(
      this.gltf.scene.getObjectByName('Dark'),
      'https://handybookmark.com/login'
    ) as ClickRaycast
    // this.handyWeb = this.gltf.scene.getObjectByName('HandyWeb') as ClickRaycast
    // this.handyStore = this.gltf.scene.getObjectByName(
    //   'ChromeWebStore'
    // ) as ClickRaycast

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
      .scale(0.5, 0.5, 0.5)
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
    for (let z = 0; z < 13; z++) {
      const zGap = z * 2.1
      for (let x = 0; x < 18; x++) {
        const xGap = x * 1.56
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

    // Ray Casting Handy Website xxxxxxxxxxxxxxxxxxxxxxx3xxxxxxxxxxxxxxxxxx

    this.clickables.push(handyStoreModel)
    this.clickables.push(handyWebModel)
    this.clickables.push(lightSS)
    this.clickables.push(darkSS)

    // Ray Casting Youtube Video xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const youtubeOut = this.youtube.children[0] as ClickRaycast
    const youtubeIn = this.youtube.children[1] as ClickRaycast
    const youtube = this.youtube
    youtubeIn.hovered = false
    youtubeOut.hovered = false
    const x = youtube.scale.x
    const y = youtube.scale.y
    const z = youtube.scale.z
    youtubeOut.update = (delta: number) => {
      //Hover animation

      if (youtubeOut.hovered || youtubeIn.hovered) {
        youtube.scale.x = lerp(youtube.scale.x, x * 5.5, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * 5.5, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * 5.5, delta * 5)
      } else {
        youtube.scale.x = lerp(youtube.scale.x, x * 3.5, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * 3.5, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * 3.5, delta * 5)
      }
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
    bookmarkIcon.update = (instanceId: number) => {
      //DO Nothing
    }
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

    this.nodejsModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.mongodbModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
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
