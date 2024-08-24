import * as THREE from 'three'

import './style.css'

import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Clickable from './class/Clickable'

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer

const api = {
  count: 150,
  distribution: 'random',
  resample: resample,
  surfaceColor: 0x96a39a,
  // backgroundColor: 0xe39469,
  backgroundColor: 0x95a5a6,
}

let controls: OrbitControls
let stemMesh: THREE.InstancedMesh, blossomMesh: THREE.InstancedMesh
let stemGeometry, blossomGeometry
let stemMaterial, blossomMaterial
const clock = new THREE.Clock()
let delta = 0

let pillerModel: THREE.Mesh
let planeModel: THREE.Mesh
let welcomeModel: THREE.Mesh
const clickables: Clickable[] = [] // used in the raycaster intersects methods
let intersects
const raycaster = new THREE.Raycaster()

let sampler: MeshSurfaceSampler
const count = api.count
const ages = new Float32Array(count)
const scales = new Float32Array(count)
const dummy = new THREE.Object3D()

const _position = new THREE.Vector3()
const _normal = new THREE.Vector3()
const _scale = new THREE.Vector3()

// let surfaceGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed()
// const axesHelper = new THREE.AxesHelper(5)

let surfaceGeometry = new THREE.PlaneGeometry(50, 50).toNonIndexed()
surfaceGeometry.rotateX(4.71239)
/* const surfaceGeometry = new THREE.TorusKnotGeometry(
  10,
  3,
  100,
  16
).toNonIndexed() */
// const surfaceMaterial = new THREE.MeshLambertMaterial({
//   color: api.surfaceColor,
//   wireframe: false,
// })
// const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)

// Source: https://gist.github.com/gre/1650294
const easeOutCubic = function (t: number) {
  return --t * t * t + 1
}

// Scaling curve causes particles to grow quickly, ease gradually into full scale, then
// disappear quickly. More of the particle's lifetime is spent around full scale.
const scaleCurve = function (t: number) {
  return Math.abs(easeOutCubic((t > 0.5 ? 1 - t : t) * 2))
}

const loader = new GLTFLoader()

loader.load('./models/Flower.glb', function (gltf) {
  loader.load('./models/HomeSection3.glb', function (home) {
    //Surface
    console.log(home.scene)
    pillerModel = home.scene.getObjectByName('Piller') as THREE.Mesh
    planeModel = home.scene.getObjectByName('Plane') as THREE.Mesh
    welcomeModel = home.scene.getObjectByName('Welcome') as THREE.Mesh

    console.log(planeModel)
    // const clickable = new Clickable(pillerModel)
    const _stemMesh = gltf.scene.getObjectByName('Stem') as THREE.Mesh
    const _blossomMesh = gltf.scene.getObjectByName('Blossom') as THREE.Mesh

    stemGeometry = _stemMesh.geometry.clone()
    blossomGeometry = _blossomMesh.geometry.clone()

    const defaultTransform = new THREE.Matrix4()
      .makeRotationX(Math.PI)
      .multiply(new THREE.Matrix4().makeScale(5, 5, 5))

    stemGeometry.applyMatrix4(defaultTransform)
    blossomGeometry.applyMatrix4(defaultTransform)

    stemMaterial = _stemMesh.material
    blossomMaterial = _blossomMesh.material

    stemMesh = new THREE.InstancedMesh(stemGeometry, stemMaterial, count)
    blossomMesh = new THREE.InstancedMesh(
      blossomGeometry,
      blossomMaterial,
      count
    )

    // Assign random colors to the blossoms.
    const blossomColor = new THREE.Color()
    const stemColor = new THREE.Color()
    const stemPalette = [0xf20587, 0xf2d479, 0xf2c879, 0xf2b077, 0xf24405]
    const blossomPalette = [0xa3cb38, 0xc4e538, 0x12cbc4, 0x1289a7, 0x009432]

    for (let i = 0; i < count; i++) {
      blossomColor.setHex(
        blossomPalette[Math.floor(Math.random() * blossomPalette.length)]
      )
      stemColor.setHex(
        stemPalette[Math.floor(Math.random() * stemPalette.length)]
      )
      blossomMesh.setColorAt(i, blossomColor)
      stemMesh.setColorAt(i, stemColor)
    }

    // Instance matrices will be updated every frame.
    stemMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    blossomMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    resample()

    init()
  })
})

function init() {
  window.addEventListener('resize', onWindowResize)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )

  //

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement)

  //
  controls = new OrbitControls(camera, renderer.domElement)

  // stats = new Stats()
  // document.body.appendChild(stats.dom)

  renderer.domElement.addEventListener('pointerdown', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    intersects = raycaster.intersectObjects(clickables, false)
    console.log(intersects)

    intersects.length && (intersects[0].object as Clickable).onClick()
  })

  //

  //

  scene = new THREE.Scene()
  scene.background = new THREE.Color(api.backgroundColor)

  //   const pointLight = new THREE.PointLight(0xaa8899, 2.5, 0, 0)
  //   pointLight.position.set(50, -25, 75)
  //   scene.add(pointLight)
  //   scene.add(axesHelper)

  scene.add(new THREE.AmbientLight(0xffffff, 3))

  //

  scene.add(stemMesh)
  scene.add(blossomMesh)

  //   scene.add(surface)
  scene.add(planeModel)

  const mouse = new THREE.Vector2()

  const pillerClickable = new Clickable(pillerModel, 1)
  const welcomeClickable = new Clickable(welcomeModel, 2)

  //   scene.add(planeModel)
  scene.add(welcomeClickable)
  scene.add(pillerClickable)
  clickables.push(pillerClickable)
  clickables.push(welcomeClickable)

  // controls.minPolarAngle = Math.PI
  // controls.maxPolarAngle = Math.PI
  controls.minPolarAngle = Math.PI / 3 + Math.PI / 15 // ~ 100 degrees
  controls.maxPolarAngle = Math.PI / 3 + Math.PI / 5 // ~ 100 degrees

  // controls.minAzimuthAngle = Math.PI / 2 + Math.PI / 16
  // controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 16

  // controls.reset()
  // controls.enableZoom = false
  controls.minDistance = 4
  controls.maxDistance = 6
  controls.enablePan = false
  controls.reset()

  camera.position.set(
    pillerClickable.position.x,
    pillerClickable.position.y + 0.1,
    pillerClickable.position.z + 5
  )
  controls.target.set(
    pillerClickable.position.x,
    pillerClickable.position.y,
    pillerClickable.position.z
  )

  //
} // End of Init()

function resample() {
  //   const vertexCount = surface.geometry.getAttribute('position').count
  const vertexCount = planeModel.geometry.getAttribute('position').count

  console.info(
    'Sampling ' +
      count +
      ' points from a surface with ' +
      vertexCount +
      ' vertices...'
  )

  //

  console.time('.build()')

  //   sampler = new MeshSurfaceSampler(surface)
  sampler = new MeshSurfaceSampler(planeModel)
    .setWeightAttribute(api.distribution === 'weighted' ? 'uv' : null)
    .build()

  console.timeEnd('.build()')

  //

  console.time('.sample()')

  for (let i = 0; i < count; i++) {
    ages[i] = Math.random()
    scales[i] = scaleCurve(ages[i])
    resampleParticle(i)
  }

  console.timeEnd('.sample()')

  stemMesh.instanceMatrix.needsUpdate = true
  blossomMesh.instanceMatrix.needsUpdate = true
}

function resampleParticle(i: number) {
  sampler.sample(_position, _normal)
  _normal.add(_position)

  dummy.position.copy(_position)
  dummy.scale.set(scales[i], scales[i], scales[i])
  dummy.lookAt(_normal)
  dummy.updateMatrix()

  stemMesh.setMatrixAt(i, dummy.matrix)
  blossomMesh.setMatrixAt(i, dummy.matrix)
} // Resample practic

function updateParticle(i: number) {
  // Update lifecycle.

  ages[i] += 0.003

  if (ages[i] >= 1) {
    ages[i] = 0.001
    scales[i] = scaleCurve(ages[i])

    resampleParticle(i)

    return
  }

  // Update scale.

  const prevScale = scales[i]
  scales[i] = scaleCurve(ages[i])
  _scale.set(
    scales[i] / prevScale,
    scales[i] / prevScale,
    scales[i] / prevScale
  )

  // Update transform.

  stemMesh.getMatrixAt(i, dummy.matrix)
  dummy.matrix.scale(_scale)
  stemMesh.setMatrixAt(i, dummy.matrix)
  blossomMesh.setMatrixAt(i, dummy.matrix)
} // Update Partical

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

//

function animate() {
  render()
}

function render() {
  delta = clock.getDelta()

  if (stemMesh && blossomMesh) {
    for (let i = 0; i < api.count; i++) {
      updateParticle(i)
    }

    stemMesh.instanceMatrix.needsUpdate = true
    blossomMesh.instanceMatrix.needsUpdate = true

    stemMesh.computeBoundingSphere()
    blossomMesh.computeBoundingSphere()
  }

  clickables.forEach((p) => {
    p.update(delta)
  })

  controls.update()

  renderer.render(scene, camera)
}

animate()
