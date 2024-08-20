import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN, { Group, Tween } from '@tweenjs/tween.js'

const colors = [
  new THREE.Color(0xf4faff),
  new THREE.Color(0xdee7e7),
  new THREE.Color(0xb7adcf),
  new THREE.Color(0x4f646f),
  new THREE.Color(0xdee7e7),
]

export type CamCtlPosition = {
  cam: {
    x: number
    y: number
    z: number
  }
  ctl: {
    x: number
    y: number
    z: number
  }
}

class CameraControlMove {
  group: Group = new Group()

  scene: THREE.Scene
  control: OrbitControls
  camera: THREE.Camera
  upBtn: HTMLButtonElement
  downBtn: HTMLButtonElement
  currentFloor: number = 0
  controlTweenScene: Tween[] = []
  cameraTweenScene: Tween[] = []

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    control: OrbitControls
  ) {
    this.scene = scene
    // this.scene.background = new THREE.Color(colors[0])
    this.camera = camera
    this.control = control
    this.upBtn = document.getElementById('up-btn') as HTMLButtonElement
    this.downBtn = document.getElementById('down-btn') as HTMLButtonElement
    this.upBtn.addEventListener('click', (e) => {
      this.goUp()
    })
    this.downBtn.addEventListener('click', (e) => {
      this.goDown()
    })
  }

  positionCamera() {
    this.downBtn.disabled = true
    this.upBtn.disabled = true
    const floorNum = 0
    this.scene.background = colors[floorNum]
    this.cameraTweenScene[floorNum].start()
    this.controlTweenScene[floorNum].start().onComplete(() => {
      this.downBtn.disabled = false
      this.upBtn.disabled = false
    })

    // this.control.target.set(mesh.position.x, mesh.position.y, mesh.position.z)
    this.control.minPolarAngle = Math.PI / 5 // ~ 100 degrees
    this.control.maxPolarAngle = Math.PI / 2 + Math.PI / 16 // ~ 100 degrees
    // this.control.minAzimuthAngle = Math.PI / 2 + Math.PI / 16
    // this.control.maxAzimuthAngle = Math.PI / 2 + Math.PI / 16

    // this.control.enableRotate = false
    // this.control.enableZoom = false
    this.control.enablePan = false
    this.control.minDistance = 4
    this.control.maxDistance = 16
  }

  goUp() {
    // console.log(this.currentFloor)
    // this.upBtn.disabled = true
    this.disableControl()
    // Down Arrow Press
    let floorNum = this.currentFloor
    if (this.currentFloor == 0) {
      floorNum = 4
      this.currentFloor = 4
    } else {
      floorNum = --this.currentFloor
    }

    this.scene.background = colors[floorNum]
    this.cameraTweenScene[floorNum].startFromCurrentValues()
    this.controlTweenScene[floorNum].startFromCurrentValues().onComplete(() => {
      this.enableControl()
    })
  }
  async goDown() {
    // console.log(this.currentFloor)
    // this.downBtn.disabled = true
    this.disableControl()
    // Down Arrow Press
    let floorNum = this.currentFloor
    if (this.currentFloor == 4) {
      floorNum = 0
      this.currentFloor = 0
    } else {
      floorNum = ++this.currentFloor
    }

    this.scene.background = colors[floorNum]
    this.cameraTweenScene[floorNum].startFromCurrentValues()
    this.controlTweenScene[floorNum].startFromCurrentValues().onComplete(() => {
      this.enableControl()
    })
  }
  animation(time: number) {
    this.group.update()
  }

  addTween(scene: THREE.Mesh, pageControl: CamCtlPosition) {
    const camTween = new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: scene.position.x + pageControl.cam.x,
          y: scene.position.y + pageControl.cam.y,
          z: scene.position.z + pageControl.cam.z,
        },
        2000
      )
      .onUpdate((cod) => {
        this.camera.position.set(cod.x, cod.y, cod.z)
      })
      .easing(TWEEN.Easing.Exponential.InOut)
    const ctlTween = new TWEEN.Tween(this.control.target)
      .to(
        {
          x: scene.position.x + pageControl.ctl.x,
          y: scene.position.y + pageControl.ctl.y,
          z: scene.position.z + pageControl.ctl.z,
        },
        2000
      )
      .onUpdate((cod) => {
        this.control.target.set(cod.x, cod.y, cod.z)
      })
      .easing(TWEEN.Easing.Exponential.InOut)

    this.cameraTweenScene.push(camTween)
    this.controlTweenScene.push(ctlTween)
    this.group.add(camTween, ctlTween)
  }
  disableControl() {
    this.upBtn.disabled = true
    this.downBtn.disabled = true
    this.control.enableRotate = false
    // this.control.enablePan = false
  }
  enableControl() {
    this.upBtn.disabled = false
    this.downBtn.disabled = false
    this.control.enableRotate = true
    // this.control.enablePan = true
  }
}

export default CameraControlMove
