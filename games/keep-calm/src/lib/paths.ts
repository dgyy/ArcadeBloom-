import { vec3 } from './util/math'
import { mesh } from './util/three'

let catmullRomCurve3 = (points: THREE.Vector3[]) =>
  new THREE.CatmullRomCurve3(points)

let addPoint = (points: THREE.Vector3[], x: number, z: number) =>
  points.push(vec3.set(x, 0, z).clone())

let createPath = (dir: 1 | -1) => {
  let points: THREE.Vector3[] = []
  let n = 10
  let x = 0.4 * dir
  let z = 0

  addPoint(points, x, z)
  x += (0.5 * dir)
  addPoint(points, x, z)

  for (let i = 0; i < n; i++) {
    x += (Math.random() * dir)
    z = ((Math.random() - 0.5) * 2)
    addPoint(points, x, z)
  }

  let path = catmullRomCurve3(points)
  let smoothPath = catmullRomCurve3(path.getPoints(n * 50))
  let tubeGeometry = new THREE.TubeGeometry(smoothPath, n * 10, 0.02, 6, false)
  let material = new THREE.MeshStandardMaterial({ color: '#B0BEC5', roughness: 1 })
  return { smoothPath, mesh: mesh(tubeGeometry, material) }
}

export let curves = [createPath(-1), createPath(1)] as const

export let paths = (scene: THREE.Scene) => {
  scene.add(curves[0].mesh, curves[1].mesh)
}
