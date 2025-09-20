import './lib/components'
import { skyBlue, kellyGreen } from './lib/constants/colors'
import { attrib, create } from './lib/util/dom'
import { aScene } from './lib/scene'
import { castleHealth, laserIntersection } from './lib/stores'
import './lib/weapons'

THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false
THREE.Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = false

aScene.append(create('a-sky', {
  color: skyBlue
}))

aScene.append(create('a-light', {
  type: 'ambient',
  color: '#445451'
}))

aScene.append(create('a-camera', {
  position: '0 0.5 1.8',
  'look-controls-enabled': false,
}))

let text = create('a-text', { value: 'Castle health: 100%', width: '2', height: '1', position: '-0.5 1 -1', rotation: '0 0 0' })
aScene.append(text)

castleHealth.subscribe((value) => attrib(text, 'value', `Castle health: ${value.toFixed(1)}%`))

aScene.append(create('a-cylinder', {
  radius: 30,
  height: 0.01,
  color: kellyGreen,
  class: 'collidable',
  raycasted: '',
}, {
  intersection(event) {
    laserIntersection.update((value) => value.copy(event.detail.point))
  }
}))

let h1 = create('h1', {
  class: 'z-10 fixed text-white text-9xl text-center w-full'
})
h1.innerHTML = '<q>Keep Calm</q>'

let h2 = create('h2', {
  class: 'z-10 m-0 fixed bottom-5 right-24 text-3xl text-white'
})
h2.innerHTML = 'xr' in navigator
  ? 'Begin thy reign →'
  : 'Thy majesty must procure a magical VR crown'

document.body.append(h1, h2, aScene)
