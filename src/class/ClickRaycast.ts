import { Mesh, Vector3, Clock } from 'three'
import * as THREE from 'three'
import { objectWorldMatrix } from 'three/webgpu'

/* function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
} */

interface ClickRaycast extends Mesh {
  //   objType: number
  direction: number
  //   meshObj: THREE.Mesh
  pause: boolean
  y: number
  //   colorTo: Color
  //   defaultColor: Color
  //   geometry: BufferGeometry
  //   material: MeshStandardMaterial

  clickObj(): void
  update(delta: number): void
}

export default ClickRaycast
