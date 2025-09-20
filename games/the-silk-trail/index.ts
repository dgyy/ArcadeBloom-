import { init, initPointer, GameLoop, onPointer } from 'kontra'
import MUSIC from './music'
import { LEVELS, STARTING_DATA } from './constants'
import { ShopScene, RoadScene, MenuScene, MapScene } from './scenes'
import './zzfx'

const { canvas } = init()

initPointer()
let scene
let data
let music

let a = document.getElementsByTagName('a')[0]
a.addEventListener('click', (e) => {
  //@ts-ignore
  music.playbackRate.value = e.target.innerHTML === 'mute' ? 0 : 1
  //@ts-ignore
  e.target.innerHTML = e.target.innerHTML === 'mute' ? 'unmute' : 'mute'
  //@ts-ignore
  window.zzfxV = window.zzfxV === 0 ? 0.3 : 0
})
onPointer('up', () => {
  if (!music) {
    // @ts-ignore
    music = zzfxP(...zzfxM(...MUSIC))
    music.loop = true
    // TODO: remove me
    // a.click()
  }
})

const startShop = () => {
  scene && scene.shutdown()
  scene = ShopScene({ canvas, data, onNext: startMap })
}

const startRoad = () => {
  scene && scene.shutdown()
  scene = RoadScene({
    canvas,
    data,
    onNext: () => {
      if (data.levelIndex++ >= LEVELS.length - 1) {
        startWin(data.gold)
      } else {
        startShop()
      }
    },
    onWin: startWin,
    onLose: startLose,
  })
}

const startMap = () => {
  scene && scene.shutdown()
  scene = MapScene({ canvas, data, onNext: startRoad })
}

const startMenu = () => {
  data = { ...STARTING_DATA }
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    data,
    heading: 'The Silk Trail',
    description: `By Dan Whiffing`,
    button1: startMap,
  })
}

const startWin = (finalMoney = 0) => {
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    data,
    heading: 'Congratulations',
    description: `$${finalMoney}`,
    button1: startMenu,
  })
}

const startLose = () => {
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    data,
    heading: 'Game Over',
    description: '',
    button1: startMenu,
  })
}

startMenu()
// startRoad()
// startShop()
// startMap()
// startWin()
// startLose()

GameLoop({
  update: (...rest) => scene && scene.update(...rest),
  render: (...rest) => scene && scene.render(...rest),
}).start()
