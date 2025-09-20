import { t } from './three'

export let { random } = Math

export let randomPointOnCircle = (radius: number): [x: number, y: number] => {
  let theta = 2 * Math.PI * random()
  let x = radius * Math.cos(theta)
  let y = radius * Math.sin(theta)
  return [x, y]
}

export let randomPointBetweenCircles = (r1: number, r2: number): [x: number, y: number] =>
  randomPointOnCircle(/* distance */ Math.sqrt(random()) * (r2 - r1) + r1)

export let mat4 = new t.Matrix4()
export let vec3 = new t.Vector3()
export let quat = new t.Quaternion()
export let scale = new t.Vector3()
export let dummy = new t.Object3D()
