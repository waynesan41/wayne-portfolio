import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { CamCtlPosition } from '../class/CameraControlMove'
import { addRaycast, changePercent, lerp } from '../class/GlobalHelperFunction'
import ClickRaycast from '../class/ClickRaycast'

class MobileAppPage {
  dartModel: THREE.Mesh | undefined
  flutterModel: THREE.Mesh | undefined
  kotlinModel: THREE.Mesh | undefined
  javaModel: THREE.Mesh | undefined

  appModel: THREE.Mesh | undefined
  phoneModel: THREE.Mesh | undefined

  androidModel: THREE.Mesh | undefined
  planeModel: THREE.Mesh | undefined

  clickables: ClickRaycast[] = [] // used in the raycaster intersects methods
  oneClickable: ClickRaycast[] = []
  scene: THREE.Scene
  gltf: any | undefined
  pageControl: CamCtlPosition = {
    cam: { x: 1, y: 10, z: -25 },
    ctl: { x: 0, y: 4, z: 0 },
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  async loadFile(loader: GLTFLoader) {
    this.gltf = await loader.loadAsync(
      './models/compress/Mobile.glb',
      (gltf) => {
        // console.log(gltf)
        changePercent(gltf.loaded, gltf.total, 16, 48)
        // const percentComplete = (gltf.loaded / gltf.total) * 20 + 47
        // percent!.innerText = percentComplete.toString()
        return gltf
      }
    )
    this.gltf.scene.position.y = -100

    this.gltf.scene.rotation.y = Math.PI
    const sceneScale = 7.3

    this.gltf.scene.scale.set(sceneScale, sceneScale, sceneScale)

    this.dartModel = this.gltf.scene.getObjectByName('Dart') as THREE.Mesh
    this.flutterModel = this.gltf.scene.getObjectByName('Flutter') as THREE.Mesh
    this.kotlinModel = this.gltf.scene.getObjectByName('Kotlin') as THREE.Mesh
    this.javaModel = this.gltf.scene.getObjectByName('Java') as THREE.Mesh

    const planeModel = this.gltf.scene.getObjectByName('Plane') as ClickRaycast
    const androidModel = this.gltf.scene.getObjectByName('Head') as THREE.Mesh

    const arrowHelper = new THREE.ArrowHelper()
    arrowHelper.setLength(1.5, 1, 1)
    arrowHelper.setColor(new THREE.Color('blue'))
    arrowHelper.position.copy(this.gltf.scene.position)

    this.scene.add(arrowHelper)

    androidModel.getWorldPosition(androidModel.position)
    androidModel.scale.setScalar(1)
    androidModel.position.y += 1.25
    androidModel.rotation.y = Math.PI
    planeModel.moveX = androidModel.position.x
    planeModel.moveZ = androidModel.position.z
    this.gltf.scene.remove(androidModel)
    this.scene.add(androidModel)
    planeModel.rotate = Math.PI
    planeModel.update = (delta: number) => {
      // const arrowHelper = new THREE.ArrowHelper()
      // arrowHelper.setLength(0.5)
      // scene.add(arrowHelper)
      // arrowHelper.setDirection(n)
      // arrowHelper.position.copy(intersect.point)
      if (planeModel.intersectObj) {
        const n = new THREE.Vector3()
        n.copy((planeModel.intersectObj.face as THREE.Face).normal)
        n.y = 1
        // n.transformDirection(intersects[0].object.matrixWorld)
        arrowHelper.setDirection(n)
        arrowHelper.position.copy(planeModel.intersectObj.point)

        androidModel!.rotation.y = lerp(
          androidModel!.rotation.y,
          planeModel.rotate,
          delta * 3
        )
        androidModel!.position.x = lerp(
          androidModel.position.x,
          planeModel.moveX,
          delta * 5
        )
        androidModel!.position.z = lerp(
          androidModel.position.z,
          planeModel.moveZ,
          delta * 5
        )
      }
    }
    planeModel.clickObj = (position?: THREE.Intersection) => {
      // CLick
      planeModel.moveX = position!.point.x
      planeModel.moveZ = position!.point.z
      planeModel.rotate = Math.random() * 2 * Math.PI

      // androidModel!.position.z = position!.point.z
      // this.androidModel!.position.y = position!.point.y
    }
    this.oneClickable.push(planeModel)

    const appModel = addRaycast(
      this.gltf.scene.getObjectByName('App'),
      'https://play.google.com/store/apps/details?id=com.pullyourselftogether.food_inventory_tracker&pli=1'
    ) as ClickRaycast
    this.clickables.push(appModel)
    // Ray Casting Phone xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    this.phoneModel = this.gltf.scene.getObjectByName('Phone') as THREE.Mesh
    const youtubeOut = this.phoneModel.children[0] as ClickRaycast
    const youtubeIn = this.phoneModel.children[1] as ClickRaycast
    const youtube = this.phoneModel
    youtubeIn.hovered = false
    youtubeOut.hovered = false
    const x = youtube.scale.x
    const y = youtube.scale.y
    const z = youtube.scale.z

    const hoverScale = 2
    const defaultScale = 1
    youtubeOut.update = (delta: number) => {
      //Hover animation
      if (youtubeOut.hovered || youtubeIn.hovered) {
        youtube.scale.x = lerp(youtube.scale.x, x * hoverScale, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * hoverScale, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * hoverScale, delta * 5)
      } else {
        youtube.scale.x = lerp(youtube.scale.x, x * defaultScale, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * defaultScale, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * defaultScale, delta * 5)
      }
      if (youtubeOut.hovered || youtubeIn.hovered) {
        // youtube.scale.setScalar(lerp(youtube.scale.y, 0.1, delta * 5))
        youtube.scale.x = lerp(youtube.scale.x, x * hoverScale, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * hoverScale, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * hoverScale, delta * 5)
      } else {
        // youtube.scale.setScalar(lerp(youtube.scale.y, 0.07, delta * 5))

        youtube.scale.x = lerp(youtube.scale.x, x * defaultScale, delta * 5)
        youtube.scale.y = lerp(youtube.scale.y, y * defaultScale, delta * 5)
        youtube.scale.z = lerp(youtube.scale.z, z * defaultScale, delta * 5)
      }
    }
    youtubeIn.update = (delta: number) => {
      //Hover animation
    }
    youtubeIn.clickObj = () => {
      window.open(
        'https://play.google.com/store/apps/details?id=com.pullyourselftogether.food_inventory_tracker&pli=1',
        '_blank'
      )
    }
    youtubeOut.clickObj = () => {
      window.open(
        'https://play.google.com/store/apps/details?id=com.pullyourselftogether.food_inventory_tracker&pli=1',
        '_blank'
      )
    }

    this.clickables.push(youtubeOut)
    this.clickables.push(youtubeIn)

    this.scene.add(this.gltf.scene)
  }
  animation(delta: number, time: number) {
    this.dartModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.flutterModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.kotlinModel!.rotation.x = Math.sin(time) * 0.4 + 1.5
    this.javaModel!.rotation.x = Math.sin(time) * 0.4 + 1.5

    this.clickables.forEach((p) => {
      p.update(delta)
    })

    this.oneClickable.forEach((p) => {
      p.update(delta)
    })
    // this.phoneModel!.rotation.z = Math.cos(time) * 0.5
  }
}

export default MobileAppPage
