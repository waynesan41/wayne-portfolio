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
import { keyboardInput, navToggle, stopLoading } from './class/StartScript'
import mainContent from './components/MainContent'
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

  // Starter Script
  await mainContent()
  await navToggle()
  await keyboardInput(controls)

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
  cameraControlMove.positionCamera()
  //--------------------------------------------------
  // Stop Loading
  //--------------------------------------------------
  await stopLoading()

  /* let scrollPercent = 0
  document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
          document.documentElement.clientHeight)) *
      100
    ;(document.getElementById('scrollProgress') as HTMLDivElement).innerText =
      'Scroll Progress : ' + scrollPercent.toFixed(2)
  } */
  //--------------------------------------------------
  // stats = new Stats()
  // document.body.appendChild(stats.dom)
  // renderer.domElement.style.position = 'fixed'
  document.body.appendChild(renderer.domElement)
  // document.getElementById('three')?.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize)
  animate()
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

async function addDoubleClickRaycast(doubleClickable: ClickRaycast[]) {
  //Ray Cast
  renderer.domElement.addEventListener('dblclick', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(doubleClickable, true)
    // console.log(intersects)

    intersects.length &&
      (intersects[0].object as ClickRaycast).clickObj(intersects[0])
  })
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

/* function detectDoubleTap(element, callback, maxDelay = 300) {
  let lastTapTime = 0;

  element.addEventListener('touchstart', function(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;

    if (tapLength < maxDelay && tapLength > 0) {
      event.preventDefault(); // Prevent default behavior like zooming
      callback(event);
    }

    lastTapTime = currentTime;
  });
}

// Usage:
const element = document.getElementById('myElement');

detectDoubleTap(element, function(event) {
  console.log('Double tap detected!');
  // Your double-tap logic here
}); */
