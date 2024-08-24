import {
  Mesh,
  Color,
  MeshStandardMaterial,
  BufferGeometry,
  Vector3,
} from 'three'

function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}

class Pickable extends Mesh {
  hovered = false
  clicked = false
  colorTo: Color
  defaultColor: Color
  geometry: BufferGeometry
  material: MeshStandardMaterial
  v = new Vector3()

  constructor(
    geometry: BufferGeometry,
    material: MeshStandardMaterial,
    colorTo: Color
  ) {
    super()
    this.geometry = geometry
    this.material = material
    this.colorTo = colorTo
    this.defaultColor = material.color.clone()
    this.castShadow = true
  }

  update(delta: number) {
    this.rotation.x += delta / 2
    this.rotation.y += delta / 2

    // this.clicked
    //   ? (this.position.y = MathUtils.lerp(this.position.y, 0.99999, delta * 5))
    //   : (this.position.y = MathUtils.lerp(this.position.y, 0.00001, delta * 5))

    // this.clicked
    //   ? (this.position.y = lerp(this.position.y, 1, delta * 5))
    //   : (this.position.y = lerp(this.position.y, 0, delta * 5))

    // if (this.clicked) {
    //   this.position.y = lerp(this.position.y, 1, delta * 10)
    // }
    // console.log(this.position.y)

    // this.hovered
    //   ? this.material.color.lerp(this.colorTo, delta * 10)
    //   : this.material.color.lerp(this.defaultColor, delta * 10)

    this.hovered
      ? (this.material.color.lerp(this.colorTo, delta * 10),
        (this.material.roughness = lerp(
          this.material.roughness,
          0,
          delta * 10
        )),
        (this.material.metalness = lerp(
          this.material.metalness,
          1,
          delta * 10
        )))
      : (this.material.color.lerp(this.defaultColor, delta),
        (this.material.roughness = lerp(this.material.roughness, 1, delta)),
        (this.material.metalness = lerp(this.material.metalness, 0, delta)))

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

    this.clicked ? this.v.set(1.5, 1.5, 1.5) : this.v.set(1.0, 1.0, 1.0)
    this.scale.lerp(this.v, delta * 5)
  }
}

export { Pickable }
