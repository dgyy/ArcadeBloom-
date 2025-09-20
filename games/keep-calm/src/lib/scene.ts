import { trees } from './trees'
import { armies } from './armies'
import { paths } from './paths'
import { parchment } from './parchment'
import { state } from './stores'
import { create } from './util/dom'
import { skyBlue } from './constants/colors'

let renderer: THREE.WebGLRenderer

let lights = (scene: THREE.Scene) => {
  let dir = new THREE.DirectionalLight('#fff', 2)
  scene.add(dir)
  dir.position.set(1, 2, 1)

  let { shadow } = dir 
  shadow.bias = 0.000_01
  shadow.mapSize.set(2048, 2048)
  shadow.normalBias = 0.02
  shadow.map = null
  shadow.needsUpdate = true

  let { camera } = shadow
  camera.left = camera.bottom = -5
  camera.right = camera.top = 5

  camera.matrixAutoUpdate = true
}

export let aScene = create('a-scene', {
  frame: '',
  reflection: '',
  fog: `far:5;color:${skyBlue}`,
  shadow: 'type:pcfsoft',
  renderer: 'antialias:true;colorManagement:true;highRefreshRate:true;physicallyCorrectLights:true;toneMapping:ACESFilmic',
}, {
  loaded(event) {
    renderer = (event.target as unknown as { renderer: THREE.WebGLRenderer }).renderer
    renderer.xr.setFoveation(1)
    trees(scene)
    armies(scene)
    parchment(scene)
    paths(scene)
    lights(scene)
  },
  'enter-vr': () => state.set('intro')
})

export let scene = aScene.object3D as THREE.Scene
