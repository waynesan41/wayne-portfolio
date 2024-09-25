import ClickRaycast from './ClickRaycast'

const livePercent = document.getElementById('percentNumber') as HTMLSpanElement

export function changePercent(
  loaded: number,
  total: number,
  percent: number,
  gap: number
) {
  // Change Percentage
  console.log(loaded, total)
  if (loaded > total) loaded = total
  const percentComplete = Math.trunc((loaded / total) * percent + gap)
  console.log(percentComplete)
  livePercent!.innerText = percentComplete.toString()
}

export function addRaycast(
  object: ClickRaycast,
  url: string,
  object2?: ClickRaycast | null
) {
  const x = object.scale.x
  const y = object.scale.y
  const z = object.scale.z
  // console.log(object.scale.x)
  // console.log(object.scale.y)
  // console.log(object.scale.z)

  object.hovered = false
  const speed = 10

  if (object.children) {
  }

  object.update = (delta: number) => {
    if (object.hovered) {
      object.scale.x = lerp(object.scale.x, x * 1.5, delta * speed)
      object.scale.y = lerp(object.scale.y, y * 1.5, delta * speed)
      object.scale.z = lerp(object.scale.z, z * 1.5, delta * speed)
      if (object2) {
        object2.scale.x = lerp(object2.scale.x, x * 1.5, delta * speed)
        object2.scale.y = lerp(object2.scale.y, y * 1.5, delta * speed)
        object2.scale.z = lerp(object2.scale.z, z * 1.5, delta * speed)
      }
    } else {
      object.scale.x = lerp(object.scale.x, x, delta * speed)
      object.scale.y = lerp(object.scale.y, y, delta * speed)
      object.scale.z = lerp(object.scale.z, z, delta * speed)
      if (object2) {
        object2.scale.x = lerp(object2.scale.x, x, delta * speed)
        object2.scale.y = lerp(object2.scale.y, y, delta * speed)
        object2.scale.z = lerp(object2.scale.z, z, delta * speed)
      }
    }
  }

  object.clickObj = () => {
    console.log('slick')
    window.open(url, '_blank')
  }

  return object
}
export function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}
