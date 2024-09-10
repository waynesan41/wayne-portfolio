import { Mesh, Vector3, Clock } from 'three'

/* function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
} */

let clock = new Clock()
class WebAppClickable extends Mesh {
  objType: number
  direction = 2
  pause = false
  y: number = 0
  //   colorTo: Color
  //   defaultColor: Color
  //   geometry: BufferGeometry
  //   material: MeshStandardMaterial
  v = new Vector3()

  constructor(object: Mesh, type: number) {
    super()
    this.objType = type // To Know Piller or WELCOME
    // this = object
    // colorTo: Color // material: MeshStandardMaterial, // geometry: BufferGeometry,
    this.geometry = object.geometry
    this.material = object.material
    // this.scale.setScalar(0.13)
    // this.getWorldScale(object.scale)
    // this.getWorldPosition(object.position)

    // this.getWorldPosition(object.position)
    // this.position.y = object.position.y
    // this.position.x = object.position.x
    // this.position.z = object.position.z

    // this.rotation.x = object.rotation.x
    // this.rotation.y = object.rotation.y
    // this.rotation.z = object.rotation.z

    /* if (type === 1) {
      this.y = object.position.y
    } else if (type === 2) {
      this.rotation.x = 90
    } */

    // this.position.z = object.position.z
    // this.colorTo = objectcolorTo
    // this.defaultColor = material.color.clone()
    // this.castShadow = true
  }
  onClick() {
    console.log('clicked')
    if (this.objType == 1) {
      if (this.direction === 3) {
        this.direction = 0
      } else {
        this.direction++
      }
    } else if (this.objType == 2) {
      this.pause = !this.pause
    }
  }
  update(delta: number) {
    const time = clock.getElapsedTime()

    // Object is Piller
    /* if (this.objType === 1) {
      this.position.y = this.y + Math.cos(time) * 0.1
      // this.rotation.x += delta / 2
      // this.clicked ? this.scale.setScalar(2) : this.scale.setScalar(1)
      if (this.direction === 0) {
        this.rotation.y -= delta / 2
      } else if (this.direction === 2) {
        this.rotation.y += delta / 2
      }
    }
    // Object is Welcome
    else if (this.objType === 2) {
      if (!this.pause) {
        this.rotation.z += delta / 2
        this.rotation.x = Math.sin(time) * 0.2 + 1.7
      }
    }
 */
    /* this.clicked
        ? (this.position.y = MathUtils.lerp(this.position.y, 1, delta * 5))
        : (this.position.y -= MathUtils.lerp(this.position.y, 0, delta * 5)) */

    //console.log(this.position.y)

    // this.clicked
    //   ? (this.position.y = lerp(this.position.y, 1, delta * 5))
    //   : (this.position.y = lerp(this.position.y, 0, delta * 5))

    // this.hovered
    //   ? this.material.color.lerp(this.colorTo, delta * 10)
    //   : this.material.color.lerp(this.defaultColor, delta * 10)

    // this.hovered
    //   ? (this.material.color.lerp(this.colorTo, delta * 10),
    //     (this.material.roughness = lerp(this.material.roughness, 0, delta * 10)),
    //     (this.material.metalness = lerp(this.material.metalness, 1, delta * 10))
    //     )
    //   : (this.material.color.lerp(this.defaultColor, delta),
    //     (this.material.roughness = lerp(this.material.roughness, 1, delta)),
    //     (this.material.metalness = lerp(this.material.metalness, 0, delta)))

    // this.clicked
    //   ? this.scale.set(
    //       MathUtils.lerp(this.scale.x, 1.5, delta * 5),
    //       MathUtils.lerp(this.scale.y, 1.5, delta * 5),
    //       MathUtils.lerp(this.scale.z, 1.5, delta * 5)
    //     )
    //   : this.scale.set(
    //       MathUtils.lerp(this.scale.x, 1.0, delta),
    //       MathUtils.lerp(this.scale.y, 1.0, delta),
    //       MathUtils.lerp(this.scale.z, 1.0, delta)
    //     )

    // this.clicked
    //   ? this.scale.set(
    //       lerp(this.scale.x, 1.5, delta * 5),
    //       lerp(this.scale.y, 1.5, delta * 5),
    //       lerp(this.scale.z, 1.5, delta * 5)
    //     )
    //   : this.scale.set(
    //       lerp(this.scale.x, 1.0, delta),
    //       lerp(this.scale.y, 1.0, delta),
    //       lerp(this.scale.z, 1.0, delta)
    //     )

    // this.clicked ? this.v.set(1.5, 1.5, 1.5) : this.v.set(1.0, 1.0, 1.0)
    // this.scale.lerp(this.v, delta * 5)
  }
}

export default WebAppClickable
