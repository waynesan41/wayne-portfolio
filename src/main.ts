import * as THREE from 'three'
import './style.css'

import Stats from 'three/addons/libs/stats.module.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import HomePage from './Pages/HomePage'
import Clickable from './class/Clickable'
import CameraControlMove from './class/CameraControlMove'
import HomeFlower from './class/Flowers'
import WebAppPage from './Pages/WebAppPage'
import WorkPage from './Pages/WorkPage'
import EducationPage from './Pages/EducationPage'
import AndroidPage from './Pages/AndroidPage'
import { navToggle } from './class/StartScript'

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  cameraControlMove: CameraControlMove,
  intersects,
  delta: number = 0,
  time = 0

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

const clock = new THREE.Clock()

let homePage: HomePage,
  flowerGrow: HomeFlower,
  webAppPage: WebAppPage,
  androidPage: AndroidPage,
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
  await homePage.loadFile()
  addRaycast(homePage.clickables)
  // cameraControlMove.addTween(homePage.pillerModel!, homePage.pageControl)
  cameraControlMove.addTween(homePage.gltf.scene!, homePage.pageControl)

  // Flower in HOME PAGE
  flowerGrow = new HomeFlower(scene)
  await flowerGrow.loadFile()
  flowerGrow.resample(homePage.planeModel)

  // ================ WEBAPP Page Loading
  webAppPage = new WebAppPage(scene)
  await webAppPage.loadFile()
  cameraControlMove.addTween(webAppPage.gltf.scene!, webAppPage.pageControl)

  // ================ MOBILE Page Loading
  androidPage = new AndroidPage(scene)
  await androidPage.loadFile()
  cameraControlMove.addTween(androidPage.gltf.scene!, androidPage.pageControl)

  // ================ WORK Page Loading
  workPage = new WorkPage(scene)
  await workPage.loadFile()
  cameraControlMove.addTween(workPage.gltf.scene!, workPage.pageControl)

  // ================ EDUCATION Page Loading
  educationPage = new EducationPage(scene)
  await educationPage.loadFile()
  cameraControlMove.addTween(
    educationPage.gltf.scene!,
    educationPage.pageControl
  )

  //--------------------------------------------------
  cameraControlMove.positionCamera()
  //--------------------------------------------------
  let scrollPercent = 0
  document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
          document.documentElement.clientHeight)) *
      100
    ;(document.getElementById('scrollProgress') as HTMLDivElement).innerText =
      'Scroll Progress : ' + scrollPercent.toFixed(2)
  }
  //--------------------------------------------------
  // stats = new Stats()
  // document.body.appendChild(stats.dom)
  // renderer.domElement.style.position = 'fixed'
  document.body.appendChild(renderer.domElement)
  // document.getElementById('three')?.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize)
  animate()
  navToggle()
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

  controls.update()

  cameraControlMove.animation(delta)
  homePage.animation(delta)
  flowerGrow.animation(delta)
  webAppPage.animation(delta, time)

  renderer.render(scene, camera)
}

function addRaycast(clickables: Clickable[]) {
  renderer.domElement.addEventListener('pointerdown', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    // intersects = raycaster.intersectObjects(pickables, false)
    intersects = raycaster.intersectObjects(clickables, false)
    // console.log(clickables)
    console.log(intersects)
    // toggles `clicked` property for only the Pickable closest to the camera
    /* intersects.length &&
      ((intersects[0].object as Pickable).clicked = !(
        intersects[0].object as Pickable
      ).clicked) */

    intersects.length && (intersects[0].object as Clickable).onClick()
    /* intersects.length &&
      ((intersects[0].object as Clickable).pause = !(
        intersects[0].object as Clickable
      ).pause) */

    // toggles `clicked` property for all overlapping Pickables detected by the raycaster at the same time
    // intersects.forEach((i) => {
    //   ;(i.object as Pickable).clicked = !(i.object as Pickable).clicked
    // })
  })
}
