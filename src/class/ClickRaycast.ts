import { Mesh, Vector3, Clock } from 'three'
import * as THREE from 'three'
import { objectWorldMatrix } from 'three/webgpu'

/* function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
} */

interface ClickRaycast extends Mesh {
  direction: number
  hovered: boolean
  pause: boolean
  y: number

  clickObj(): void
  update(delta: number): void
}

export default ClickRaycast
