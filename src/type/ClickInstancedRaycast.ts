import { Mesh, Vector3, Clock } from 'three'
import * as THREE from 'three'
import { objectWorldMatrix } from 'three/webgpu'

interface ClickInstancedRaycast extends THREE.InstancedMesh {
  direction: number
  hovered: boolean
  pause: boolean
  y: number

  changeColor(instanceId: number): void
  clickObj(): void
  update(delta: number): void
}
export default ClickInstancedRaycast
