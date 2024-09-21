import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

// Source: https://gist.github.com/gre/1650294
const easeOutCubic = function (t: number) {
  return --t * t * t + 1
}

// Scaling curve causes particles to grow quickly, ease gradually into full scale, then
// disappear quickly. More of the particle's lifetime is spent around full scale.
const scaleCurve = function (t: number) {
  return Math.abs(easeOutCubic((t > 0.5 ? 1 - t : t) * 2))
}

class WorkArrow {
  api = {
    count: 30,
    distribution: 'random',
    // distribution: 'random',
    // resample: this.resample,
    // surfaceColor: 0x96a39a,
    // backgroundColor: 0xe39469,
  }
  scene: THREE.Scene
  ages = new Float32Array(this.api.count)
  scales = new Float32Array(this.api.count)
  dummy = new THREE.Object3D()

  sampler: MeshSurfaceSampler | undefined
  stemMesh: THREE.InstancedMesh | undefined
  blossomMesh: THREE.InstancedMesh | undefined
  stemGeometry: any
  // blossomGeometry: any
  stemMaterial: THREE.Material | THREE.Material[] | undefined
  // blossomMaterial: THREE.Material | THREE.Material[] | undefined

  _position = new THREE.Vector3()
  _normal = new THREE.Vector3()
  _scale = new THREE.Vector3()

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  //==========================================================
  // loadFile(arrowMesh: THREE.Mesh) {
  async loadFile(arrowMesh: THREE.Mesh) {
    this.stemGeometry = arrowMesh.geometry.clone()
    // this.blossomGeometry = _blossomMesh.geometry.clone()

    const scaleSize = 0.2
    const defaultTransform = new THREE.Matrix4()
      .makeRotationX(Math.PI)
      .multiply(new THREE.Matrix4().makeScale(scaleSize, scaleSize, scaleSize))

    this.stemGeometry.applyMatrix4(defaultTransform)
    // this.blossomGeometry.applyMatrix4(defaultTransform)

    this.stemMaterial = arrowMesh.material
    // this.blossomMaterial = _blossomMesh.material

    this.stemMesh = new THREE.InstancedMesh(
      this.stemGeometry,
      this.stemMaterial,
      this.api.count
    )
    // this.blossomMesh = new THREE.InstancedMesh(
    //   this.blossomGeometry,
    //   this.blossomMaterial,
    //   this.api.count
    // )

    // Assign random colors to the blossoms.
    // const blossomColor = new THREE.Color()
    const stemColor = new THREE.Color()
    const stemPalette = [
      0x7b2cbf, 0xbbd0ff, 0xb8c0ff, 0xc8b6ff, 0xe7c6ff, 0xffd6ff, 0x9d4edd,
    ]
    // const blossomPalette = [
    //   0xa3cb38, 0xc4e538, 0x12cbc4, 0x1289a7, 0x009432, 0x34ace0, 0x3ae374,
    // ]

    for (let i = 0; i < this.api.count; i++) {
      // blossomColor.setHex(
      //   blossomPalette[Math.floor(Math.random() * blossomPalette.length)]
      // )
      stemColor.setHex(
        stemPalette[Math.floor(Math.random() * stemPalette.length)]
      )
      // this.blossomMesh.setColorAt(i, blossomColor)
      this.stemMesh.setColorAt(i, stemColor)
    }

    // Instance matrices will be updated every frame.
    this.stemMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    // this.blossomMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.stemMesh.position.y = -85.5
    this.stemMesh.scale.setScalar(2.1)
    this.scene.add(this.stemMesh)
    // this.scene.add(this.blossomMesh)
  }

  //==========================================================
  resample(planeModel: THREE.Mesh | undefined) {
    //   const vertexCount = surface.geometry.getAttribute('position').count
    // const vertexCount = planeModel!.geometry.getAttribute('position').count
    // const position = planeModel!.geometry

    // console.log(vertexCount)
    // console.log(position)

    // console.info(
    //   'Sampling ' +
    //     this.api.count +
    //     ' points from a surface with ' +
    //     vertexCount +
    //     ' vertices...'
    // )

    //

    console.time('.build()')

    //   sampler = new MeshSurfaceSampler(surface)
    // console.log(planeModel)
    this.sampler = new MeshSurfaceSampler(planeModel!)
      .setWeightAttribute(null)
      // .setWeightAttribute(this.api.distribution === 'weighted' ? 'uv' : null)
      .build()

    // console.log(this.sampler)

    console.timeEnd('.build()')
    console.time('.sample()')

    for (let i = 0; i < this.api.count; i++) {
      this.ages[i] = Math.random()
      this.scales[i] = scaleCurve(this.ages[i])
      this.resampleParticle(i)
    }

    console.timeEnd('.sample()')

    this.stemMesh!.instanceMatrix.needsUpdate = true
    // this.blossomMesh!.instanceMatrix.needsUpdate = true
  }

  //==========================================================
  resampleParticle(i: number) {
    this.sampler!.sample(this._position, this._normal)
    // this.sampler!.sample(this._position, this._normal)
    this._normal.add(this._position)

    this.dummy.position.copy(this._position)
    this.dummy.scale.set(this.scales[i], this.scales[i], this.scales[i])
    this.dummy.lookAt(this._normal)
    this.dummy.updateMatrix()

    this.stemMesh!.setMatrixAt(i, this.dummy.matrix)
    // this.blossomMesh!.setMatrixAt(i, this.dummy.matrix)
  }
  //==========================================================
  // updateParticle(i: number) {
  updateParticle(i: number, delta: number) {
    // Update lifecycle.

    // this.ages[i] += 0.008
    this.ages[i] += 0.004

    if (this.ages[i] >= 1) {
      this.ages[i] = 0.001
      this.scales[i] = scaleCurve(this.ages[i])
      this.resampleParticle(i)
      return
    }

    // Update scale.

    const prevScale = this.scales[i]
    this.scales[i] = scaleCurve(this.ages[i])
    this._scale.set(
      this.scales[i] / prevScale,
      this.scales[i] / prevScale,
      this.scales[i] / prevScale
    )

    // Update transform.

    this.stemMesh!.getMatrixAt(i, this.dummy.matrix)
    this.dummy.matrix.scale(this._scale)
    this.stemMesh!.setMatrixAt(i, this.dummy.matrix)
    // this.blossomMesh!.setMatrixAt(i, this.dummy.matrix)
  } // Update Partical

  animation(delta: number) {
    // if (this.stemMesh && this.blossomMesh) {
    if (this.stemMesh) {
      for (let i = 0; i < this.api.count; i++) {
        this.updateParticle(i, delta)
      }

      this.stemMesh.instanceMatrix.needsUpdate = true
      // this.blossomMesh.instanceMatrix.needsUpdate = true

      this.stemMesh.computeBoundingSphere()
      // this.blossomMesh.computeBoundingSphere()
    }
  }
} // END of CLASS

export default WorkArrow
