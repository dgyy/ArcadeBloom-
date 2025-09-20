
import { t, instancedMesh, meshStandardMat } from './util/three'
import { vec3, dummy } from './util/math'
import { tan, brown } from './constants/colors'
import { useFrame } from './components/frame'
import { curves } from './paths'
import { castleHealth, firingLaser, laserIntersection, state } from './stores'

let count = 500
let defaultSize = 0.1
let states = new Uint8Array(count)
let transforms = new Float32Array(count * 6)
let velocities = new Float32Array(count * 6)
let intervals = new Float32Array(count)
let offsets = new Float32Array(count)

let boxes = (
  width = defaultSize,
  height = defaultSize,
  depth = defaultSize,
  x = 0,
  y = 0,
  z = 0,
  color: string
) => {
  let mesh = instancedMesh(
    new t.BoxGeometry(width, height, depth).translate(x, y, z),
    meshStandardMat({ color }),
    count
  )
  mesh.frustumCulled = false
  return mesh
}

export let armies = (scene: THREE.Scene) => {
  let headsize = 0.01
  let heads = boxes(headsize, headsize, headsize, 0, 0.04, 0, tan)

  let torsoWidth = 0.02
  let torsoHeight = 0.03
  let torsoDepth = 0.004
  let torsos = boxes(torsoWidth, torsoHeight, torsoDepth, 0, 0.02, 0, brown)

  let armWidth = 0.005
  let armLength = 0.0175
  let armX = 0.012
  let armY = 0.025
  let leftArms = boxes(armWidth, armLength, armWidth, -armX, armY, 0, tan)
  let rightArms = boxes(armWidth, armLength, armWidth, armX, armY, 0, tan)

  let parts = [heads, torsos, leftArms, rightArms]

  for (let i = 0; i < count; i += 1) {
    states[i] = 1
    intervals[i] = 5000
    offsets[i] = (i / 200) % 1
  }

  scene.add(...parts)

  state.subscribe(value => {
    if (value === 'intro') {
      setInterval(() => {
        for (let i = 0; i < count; i += 1) {
          if (intervals[i]! >= 5000) {
            states[i] = 0
            intervals[i] = 0
            offsets[i] = 0
            break
          }
        }
      }, 500)

      setInterval(() => {
        if (speed < .001) speed += 0.0001
        console.log(speed)
      }, 500)
    }
  })
  
  let speed = 0.0005

  useFrame((time, delta) => {
    for (let i = 0, k = 0; i < count; i++, k += 6) {
      let state = states[i]!
      
      // Alive and kickin'
      if (state === 0) {
        offsets[i] += speed
        if (offsets[i]! > 1) {
          castleHealth.set(castleHealth.current - 1)
          offsets[i] = 0
          console.log(castleHealth.current)
        }

        let offset = offsets[i]!

        curves[i % 2]!.smoothPath.getPointAt(1 - offset, dummy.position)
        curves[i % 2]!.smoothPath.getPointAt(1 - ((offset + 0.01) % 1), vec3)
        
        dummy.position.y = (Math.sin(time / 50) / 300) + 0.015
        dummy.lookAt(vec3.x, 0.03, vec3.z)

        if (firingLaser.current) {
          let distance = laserIntersection.current.distanceToSquared(dummy.position)
          if (distance <= 0.005) {
            states[i] = 1

            velocities[k] = (Math.random() - 0.5) * 0.1
            velocities[k + 1] = Math.random() * 0.1
            velocities[k + 2] = (Math.random() - 0.5) * 0.1
            velocities[k + 3] = (Math.random() - 0.5) * 0.1
            velocities[k + 4] = (Math.random() - 0.5) * 0.1
            velocities[k + 5] = (Math.random() - 0.5) * 0.1
            
            transforms[k] = dummy.position.x
            transforms[k + 1] = dummy.position.y
            transforms[k + 2] = dummy.position.z
            transforms[k + 3] = dummy.rotation.x
            transforms[k + 4] = dummy.rotation.y
            transforms[k + 5] = dummy.rotation.z
          }
        }
      // Blown up
      } else if (state === 1) {
        intervals[i] += delta
        transforms[k] += velocities[k]!
        transforms[k + 1] += velocities[k + 1]!
        transforms[k + 2] += velocities[k + 2]!
        transforms[k + 3] += velocities[k + 3]!
        transforms[k + 4] += velocities[k + 4]!
        transforms[k + 5] += velocities[k + 5]!
        dummy.position.set(transforms[k]!, transforms[k + 1]!, transforms[k + 2]!)
        dummy.rotation.set(transforms[k + 3]!, transforms[k + 4]!, transforms[k + 5]!)
      }

      dummy.updateMatrix()
      for (let part of parts) {
        part.setMatrixAt(i, dummy.matrix)
      }
    }

    for (let part of parts) {
      part.instanceMatrix.needsUpdate = true
    }
  })
}
