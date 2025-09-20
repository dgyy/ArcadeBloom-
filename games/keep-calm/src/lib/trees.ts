import { randomPointBetweenCircles, random, vec3, mat4 } from './util/math'
import { instancedMesh, meshStandardMat } from './util/three'

export let trees = (scene: THREE.Scene) => {
  let count = 1000
  let scale = 0.3
  let radius = 0.15
  let height = 0.5
  let mesh = instancedMesh(
    new THREE.ConeGeometry(radius, height, 4, 1, true),
    meshStandardMat({ color: '#388E3C' }),
    count)

  for (let i = 0; i < count; i++) {
    let [x, z] = randomPointBetweenCircles(2, 4)
    let scaleY = random() + scale
    mesh.setMatrixAt(i, mat4
      .makeTranslation(vec3.set(x, (height / 2) * scaleY, z))
      .scale(vec3.set(random() + scale, scaleY, random() + scale)))
  }
  scene.add(mesh)
}
