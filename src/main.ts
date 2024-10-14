import * as THREE from 'three'
import './style.css'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import HomePage from './Pages/HomePage'
import CameraControlMove from './class/CameraControlMove'
import HomeFlower from './class/Flowers'
import WebAppPage from './Pages/WebAppPage'
import WorkPage from './Pages/WorkPage'
import EducationPage from './Pages/EducationPage'
import MobileAppPage from './Pages/MobileAppPage'
import {
  combindHTMLContent,
  keyboardInput,
  navToggle,
  stopLoading,
} from './class/StartScript'
import { mainContent } from './components/MainContent'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import ClickRaycast from './class/ClickRaycast'
import ClickInstancedRaycast from './type/ClickInstancedRaycast'
import WorkArrow from './class/WorkArrow'

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  cameraControlMove: CameraControlMove,
  intersects,
  delta: number = 0,
  time = 0,
  clickable: ClickRaycast[] = [],
  hoverable: ClickRaycast[] = [],
  doubleClickable: ClickRaycast[] = []
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/') // loading from a CDN
dracoLoader.setDecoderPath('jsm/libs/draco/') // loading from own webserver
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

const clock = new THREE.Clock()

let homePage: HomePage,
  flowerGrow: HomeFlower,
  workArrow: WorkArrow,
  webAppPage: WebAppPage,
  mobileAppPage: MobileAppPage,
  workPage: WorkPage,
  educationPage: EducationPage

init()

async function init() {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    700
  )
  controls = new OrbitControls(camera, renderer.domElement)

  await new RGBELoader()
    // .loadAsync('img/venice_sunset_1k.hdr')
    .loadAsync('img/sky-compress.hdr')
    .then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
    })

  cameraControlMove = new CameraControlMove(scene, camera, controls)

  // ================ Home Page Loading
  homePage = new HomePage(scene)
  await homePage.loadFile(loader)
  cameraControlMove.addTween(homePage.gltf.scene!, homePage.pageControl)
  clickable = clickable.concat(homePage.clickables) // Clickable

  // Flower in HOME PAGE
  flowerGrow = new HomeFlower(scene)
  await flowerGrow.loadFile(loader)
  flowerGrow.resample(homePage.planeModel)
  // flowerGrow.resample(scene)

  // ================ WEBAPP Page Loading
  webAppPage = new WebAppPage(scene)
  await webAppPage.loadFile(loader)
  cameraControlMove.addTween(webAppPage.gltf.scene!, webAppPage.pageControl)
  doubleClickable = clickable.concat(webAppPage.clickables) // Double Click
  hoverable = clickable.concat(webAppPage.clickables)
  // doubleClickable = webAppPage.clickables // Double Click
  // hoverable = webAppPage.clickables

  // ================ MOBILE Page Loading
  mobileAppPage = new MobileAppPage(scene)
  await mobileAppPage.loadFile(loader)
  cameraControlMove.addTween(
    mobileAppPage.gltf.scene!,
    mobileAppPage.pageControl
  )
  doubleClickable = doubleClickable.concat(mobileAppPage.clickables) // Double Click
  hoverable = hoverable.concat(mobileAppPage.clickables) // Double Click
  clickable = clickable.concat(mobileAppPage.oneClickable) // Double Click
  hoverable = hoverable.concat(mobileAppPage.oneClickable)

  // ================ WORK Page Loading
  workPage = new WorkPage(scene)
  await workPage.loadFile(loader)
  cameraControlMove.addTween(workPage.gltf.scene!, workPage.pageControl)

  // clickable = clickable.concat(workPage.clickables) // Double Click
  doubleClickable = doubleClickable.concat(workPage.clickables) // Double Click
  hoverable = hoverable.concat(workPage.clickables) // Double Click

  // Arrow in Work Page
  workArrow = new WorkArrow(scene)
  await workArrow.loadFile(workPage.arrowModel!)
  // await workArrow.loadFile(loader)
  workArrow.resample(workPage.planeModel)

  // ================ EDUCATION Page Loading
  educationPage = new EducationPage(scene)
  await educationPage.loadFile(loader)
  cameraControlMove.addTween(
    educationPage.gltf.scene!,
    educationPage.pageControl
  )
  doubleClickable = doubleClickable.concat(educationPage.clickables)
  hoverable = hoverable.concat(educationPage.clickables)

  await addClickRaycast(clickable)
  await addDoubleClickRaycast(doubleClickable)
  await addHoverRaycast(hoverable)

  //--------------------------------------------------
  // Set Camera Floor
  const startFloor = 0
  cameraControlMove.positionCamera(startFloor)

  // Starter Script
  await mainContent(startFloor)
  await combindHTMLContent()
  await navToggle()
  await keyboardInput(controls)

  //--------------------------------------------------
  // Stop Loading
  //--------------------------------------------------

  document.body.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize)
  animate()
  await stopLoading()
  renderer.setSize(window.innerWidth, window.innerHeight)
} // END Init

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)
  delta = clock.getDelta()
  time = clock.getElapsedTime()

  controls.update(delta)

  cameraControlMove.animation(delta)
  homePage.animation(delta)
  flowerGrow.animation(delta)
  workArrow.animation()
  mobileAppPage.animation(delta, time)
  webAppPage.animation(delta, time)
  workPage.animation(delta, time)
  educationPage.animation(delta, time)
  renderer.render(scene, camera)
}

async function addClickRaycast(clickables: ClickRaycast[]) {
  renderer.domElement.addEventListener('pointerdown', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(clickables, true)
    // intersects = raycaster.intersectObjects(pickables, false)

    intersects.length &&
      (intersects[0].object as ClickRaycast).clickObj(intersects[0])
  })
}
let expired: any
async function addDoubleClickRaycast(doubleClickable: ClickRaycast[]) {
  //Ray Cast
  renderer.domElement.addEventListener('dblclick', (e) => {
    dbTouch(e)
  })

  let touchType
  if (navigator.userAgent.includes('Android')) {
    touchType = 'touchend'
  } else {
    touchType = 'touchstart'
  }
  renderer.domElement.addEventListener(touchType, (e: any) => {
    // Function goes
    // console.log(e)
    // console.log(e.touches[0])

    if (e.touches.length === 1) {
      if (!expired) {
        expired = e.timeStamp + 400
      } else if (e.timeStamp <= expired) {
        // remove the default of this event ( Zoom )
        // e.preventDefault()

        dbTouch(e.touches[0])
        // then reset the variable for other "double Touches" event
        expired = null
      } else {
        // if the second touch was expired, make it as it's the first
        expired = e.timeStamp + 400
      }
    }
  })
  function dbTouch(e: any) {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    // mouse.set(
    //   (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    //   -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    // )
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(doubleClickable, true)
    // console.log(intersects)

    intersects.length &&
      (intersects[0].object as ClickRaycast).clickObj(intersects[0])
  }
}

async function addHoverRaycast(hoverable: ClickRaycast[]) {
  renderer.domElement.addEventListener('touchmove', (e) => {
    move(e)
  })
  renderer.domElement.addEventListener('mousemove', (e) => {
    move(e)
  })
  // Function
  function move(e: any) {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )

    hoverable.forEach((p) => (p.hovered = false))

    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(hoverable, false)
    // console.log(intersects)

    if (intersects.length) {
      // IF it is an Instanced Mesh
      const instanceId = intersects[0].instanceId
      if (instanceId) {
        const instanceObj = intersects[0].object as ClickInstancedRaycast
        instanceObj.changeColor(instanceId)
      } else {
        ;(intersects[0].object as ClickRaycast).intersectObj = intersects[0]

        // For Regular Hover
        ;(intersects[0].object as ClickRaycast).hovered = true
      }
    }
  }
}

// Double Touch Google ANSWER

/* Based on this http://jsfiddle.net/brettwp/J4djY/*/
/* function detectDoubleTapClosure() {
  let lastTap = 0
  let timeout: number
  return function detectDoubleTap(event: any) {
    const curTime = new Date().getTime()
    const tapLen = curTime - lastTap
    if (tapLen < 500 && tapLen > 0) {
      console.log('Double tapped!')
      event.preventDefault()
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout)
      }, 500)
    }
    lastTap = curTime
  }
}


if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  document.body.addEventListener('touchend', detectDoubleTapClosure(), {
    passive: false,
  })
}
 */
