import { shadows } from './util/shadows'
import { eventObject } from './util/helpers'
import { getObjectByName } from './util/three'
import { create, attrib } from './util/dom'
import { aScene, scene } from './scene'
import { useFrame } from './components/frame'
import { firingLaser, firingBomb, laserIntersection } from './stores'

let raycaster = 'objects:.collidable;lineOpacity:0;autoRefresh:false;interval:30'

let orbHandEl = create('a-entity', {
  visible: false,
  'laser-controls': `hand:left;model:false`,
  raycaster: 'enabled:false;lineOpacity:0',
}, {
  triggerdown() { firingBomb.set(true) },
  triggerup() { firingBomb.set(false) }
})

let scepterHandEl = create('a-entity', {
  visible: false,
  'laser-controls': `hand:right;model:false`,
  raycaster,
}, {
  triggerdown() { firingLaser.set(true) },
  triggerup() { firingLaser.set(false) }
})

aScene.append(orbHandEl, scepterHandEl)

attrib(orbHandEl, 'visible', true)
attrib(scepterHandEl, 'visible', true)

const laser = new THREE.Mesh(
  new THREE.CylinderGeometry(0.025, 0.025, 10).translate(0, 5.35, 0).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial(),
)

const laserEnd = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.06, 2),
  new THREE.MeshBasicMaterial()
)

firingLaser.subscribe((value) => (laser.visible = laserEnd.visible = value))

aScene.append(create('a-gltf-model', {
  src: 'castle-prod-transformed.glb',
}, {
  'model-loaded': (event) => {
    let scepter = getObjectByName(eventObject(event), 'scepter')!
    let orb = getObjectByName(eventObject(event), 'orb')!

    scepterHandEl.object3D.add(scepter, laser)
    orbHandEl.object3D.add(orb)
  
    scene.add(laserEnd)
    shadows(scene)
    scene.traverse((object) => {
      object.updateMatrix()
    })
  }
}))

useFrame(() => {
  if (firingLaser.current) {
    let rand = (Math.random() + 0.5) - 0.5
    laser.scale.set(rand, rand, 1)
    laserEnd.scale.setScalar(rand)
    laserEnd.position.copy(laserIntersection.current)
  }
})
