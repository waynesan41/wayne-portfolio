import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN, { Group, Tween } from '@tweenjs/tween.js'

const colors = [
  // new THREE.Color(0x0fbcf9),
  new THREE.Color(0x09759c),
  new THREE.Color(0x5a716a),
  new THREE.Color(0xb79c56),
  new THREE.Color(0x575fcf),
  new THREE.Color(0x227093),
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
  navBtn: HTMLButtonElement[]
  content: HTMLElement[]
  currentFloor: number = 1
  // previousFloor: number = 0
  controlTweenScene: Tween[] = []
  cameraTweenScene: Tween[] = []

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    control: OrbitControls
  ) {
    this.scene = scene
    this.scene.background = new THREE.Color(colors[0])
    this.camera = camera
    this.control = control
    this.upBtn = document.getElementById('up-btn') as HTMLButtonElement
    this.downBtn = document.getElementById('down-btn') as HTMLButtonElement
    this.upBtn.addEventListener('click', () => {
      this.goUp()
    })
    this.downBtn.addEventListener('click', () => {
      this.goDown()
    })
    this.navBtn = document.getElementsByClassName('option') as any
    this.content = document.getElementsByClassName('content') as any
    console.log(this.content)
    // Add Event Listener for Menu Button
    for (let i = 0; i < this.navBtn.length; i++) {
      this.navBtn[i].addEventListener('click', () => {
        // const num = e.target.parentNode.getAttribute('data')
        const num = Number(this.navBtn[i].getAttribute('data'))
        console.log(num)
        this.selectFloor(num)
      })
    }
  }

  positionCamera() {
    this.downBtn.disabled = true
    this.upBtn.disabled = true
    const floorNum = 1
    this.currentFloor = floorNum
    // this.scene.background = colors[floorNum]
    // this.scene.backgroundIntensity = 0.1

    this.cameraTweenScene[floorNum].start()
    this.controlTweenScene[floorNum].start().onComplete(() => {
      this.downBtn.disabled = false
      this.upBtn.disabled = false
    })
    this.scene.background = new THREE.Color(colors[floorNum])

    // this.control.target.set(mesh.position.x, mesh.position.y, mesh.position.z)
    //=================================================
    // this.control.minPolarAngle = Math.PI / 5 // ~ 100 degrees
    // this.control.maxPolarAngle = Math.PI / 2 + Math.PI / 16 // ~ 100 degrees
    //=================================================
    // this.control.minAzimuthAngle = Math.PI / 2 + Math.PI / 16
    // this.control.maxAzimuthAngle = Math.PI / 2 + Math.PI / 16

    // this.control.enableRotate = false
    // this.control.enableZoom = false

    //=============================================
    this.control.enablePan = false
    // this.control.minDistance = 4
    // this.control.maxDistance = 18

    // this.animateBackground(2)
  }

  goUp() {
    // console.log(this.currentFloor)
    // this.upBtn.disabled = true
    // Down Arrow Press
    let floorNum = this.currentFloor
    if (this.currentFloor == 0) {
      floorNum = 4
      this.currentFloor = 4
    } else {
      floorNum = --this.currentFloor
    }
    this.doAnimation(floorNum)
  }
  async goDown() {
    // console.log(this.currentFloor)
    // this.downBtn.disabled = true
    // Down Arrow Press
    let floorNum = this.currentFloor
    if (this.currentFloor == 4) {
      floorNum = 0
      this.currentFloor = 0
    } else {
      floorNum = ++this.currentFloor
    }
    this.doAnimation(floorNum)
  }
  animation(delta: number) {
    this.group.update()
  }

  selectFloor(floorNum: number) {
    console.log(floorNum)
    this.currentFloor = floorNum
    this.doAnimation(floorNum)
  }

  doAnimation(floorNum: number) {
    // Menu Bar Highlight
    for (let i = 0; i < this.navBtn.length; i++) {
      if (floorNum == i) this.navBtn[i].classList.add('selected')
      else this.navBtn[i].classList.remove('selected')
    }
    // Current Display Content
    const currentContent = this.content[floorNum]

    // Content Animation
    for (let i = 0; i < this.content.length; i++) {
      if (this.content[i].classList.contains('visible')) {
        if (i != floorNum) {
          if (i > floorNum) {
            // Prepare Animation to show
            // Hide Animation
            currentContent.classList.toggle('hide')
            // Old Content
            this.content[i].classList.toggle('display')
            // Hide the Block
            setTimeout(() => {
              this.content[i].classList.toggle('visible')
              // Old Content
              this.content[i].classList.toggle('display')
            }, 400)
            currentContent.classList.toggle('visible')
            setTimeout(() => {
              currentContent.classList.toggle('hide')
            }, 100)
          } else {
            // Prepare Animation to show
            // Hide Animation
            currentContent.classList.toggle('display')
            this.content[i].classList.toggle('hide')
            // Hide the Block
            setTimeout(() => {
              this.content[i].classList.toggle('visible')
              this.content[i].classList.toggle('hide')
            }, 400)
            currentContent.classList.toggle('visible')
            setTimeout(() => {
              currentContent.classList.toggle('display')
            }, 100)
          }
        }
      }
    }
    // Three Animation
    this.disableControl()
    for (let i = 0; i < this.navBtn.length; i++) {
      this.navBtn[i].disabled = true
    }

    this.animateBackground(floorNum)
    this.cameraTweenScene[floorNum].startFromCurrentValues()
    this.controlTweenScene[floorNum].startFromCurrentValues().onComplete(() => {
      this.enableControl()
      for (let i = 0; i < this.navBtn.length; i++) {
        this.navBtn[i].disabled = false
      }
    })
  } // End DO animation

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

  addTween(scene: THREE.Mesh, pageControl: CamCtlPosition) {
    const camTween = new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: scene.position.x + pageControl.cam.x,
          y: scene.position.y + pageControl.cam.y,
          z: scene.position.z + pageControl.cam.z,
        },
        500
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
        500
      )
      .onUpdate((cod) => {
        this.control.target.set(cod.x, cod.y, cod.z)
      })
      .easing(TWEEN.Easing.Exponential.InOut)

    this.cameraTweenScene.push(camTween)
    this.controlTweenScene.push(ctlTween)
    this.group.add(camTween, ctlTween)
  }
  animateBackground(floorNum: number) {
    const bgTween = new TWEEN.Tween(this.scene.background as THREE.Color)
      .dynamic(true)
      .to(colors[floorNum], 500)
      .onUpdate((cod) => {
        this.scene.background = cod
      })
      .easing(TWEEN.Easing.Exponential.InOut)
    this.group.add(bgTween)
    bgTween.startFromCurrentValues()
  }
}

export default CameraControlMove
