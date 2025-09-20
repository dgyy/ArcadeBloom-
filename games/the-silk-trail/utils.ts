import { collides } from 'kontra'

// prettier-ignore
const SOUNDS = {
  playerHit: [2,,1050,.01,.01,.02,3,1.06,-66,,,.15,,,,,.05,.82,.01,.03],
  // clickDisabled: [1.05,,51,,,.21,,2.72,,,,,,.2,,.2,,.67,.03],
  click: [,,1768,,.01,.01,,.2,14,39,,,,,.5,.3,,.31,.01],
  catch: [2,,1182,,.01,0,1,.43,-84,50,,,,,,,.14,.94,.08,.01],
  swap: [1,,10,,.01,.01,,1.76,92,-1,,,,.6,-6.7,,,.42,.01],
  nextLevel: [1.66,,441,.06,.26,.34,,1.11,,,83,.05,.02,,,.1,.11,.42,.23],
  // enemyExplode: [.4,.5,902,.01,.01,.15,3,1.35,.8,.9,,,,1,,.5,,.42,.1],
  // 
  // mineExplode: [.4,.5,902,.01,.01,.15,3,1.35,.8,.9,,,,1,,.5,,.42,.1],
  // minePlaced: [,,210,.01,.01,0,,.15,,.3,54,.11,,,100,,.02,.47,,.2],
  // mineNotPlaced: [1.13,,1996,.02,.01,.01,1,1.81,-0.8,,14,.04,,,38,.1,,.11,.01],
  // mineNotPlaced2: [2,,200,,.03,.04,1,.83,-7.1,,16,.1,,,-46,3,.05,.2,.03],
  // playerCharge: [.1,0,10,1.5,,.2,1,0,.1],
  // playerChargeFull: [,,145,,,.14,1,.74,,,595,.03,,,,,.01,,.02,.03],
  // playerBlast: [1.13,,125,.01,,.01,3,1.93,-5.8,.8,,,,,,,.04,,.1,.08],
  // shieldHit: [1.99,,44,.01,.01,.02,1,2.07,,,-183,.09,,.2,-1.6,,.03,,.02,.05],
  // nextLevel: [2.01,,307,,.29,.3,1,.96,3.6,.1,332,.16,.2,,29,,.15,.46,.15],
  // playerDie: [,,176,,,.31,,.85,-1.8,,,,,.2,,.3,,.76,.08],
  // enemyShoot:[1.19,,453,,.09,.02,1,.21,-3.2,,,,,,,.1,.07,.97,.09,.05],
  // playerHit3: [,,413,,,.22,4,2.99,.5,-0.7,,,,1,.3,.3,,.83,.04],
  // planetHit2: [,,292,,.05,.11,,2.68,-3.4,,,,,.8,,.1,,.75,.06],
  // repair: [1.04,,186,.1,.03,.48,1,1.85,,,17,.08,.01,,,,,.91,,.01],
}

let muted = false
export const playSound = (key) => {
  // @ts-ignore
  if (!muted) zzfx(SOUNDS[key][0] || 1, ...SOUNDS[key].slice(1))
}

export const toggleMute = () => (muted = !muted)

export const getDist = (source, target) => {
  const x = source.x - target.x
  const y = source.y - target.y
  return Math.sqrt(x * x + y * y)
}

export const checkCollisions = (groupA, groupB, onCollide) => {
  groupA.forEach((itemA) =>
    groupB.forEach((itemB) => {
      if (collides(itemA, itemB)) onCollide(itemA, itemB)
    }),
  )
}

// let focused = true
// window.addEventListener('focus', () => (focused = true))
// window.addEventListener('blur', () => (focused = false))
// export const requestTimeout = (fn, delay) => {
//   let _delay = delay / 10

//   const loop = () => {
//     if (focused) _delay -= 1
//     if (_delay <= 0) return fn()
//     requestAnimationFrame(loop)
//   }

//   requestAnimationFrame(loop)
// }
