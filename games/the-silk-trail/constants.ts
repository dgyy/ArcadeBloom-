export const STARTING_ITEMS = [
  'empty',
  ...new Array(6).fill('').flatMap((m) => ['rock', 'copper-axe']),
]
export const STARTING_DATA = {
  levelIndex: 0,
  gold: 350,
  items: STARTING_ITEMS,
}
export const GRAVITY = 0.175
export const GROUND_Y = 455
export const MIN_SPEED = 3
export const MAX_SPEED = 8
export const MAX_WAGON_SPEED = 6
export const SIZE = 102
export const MIN_ANGLE = 3.2
export const MAX_ANGLE = 4
export const BASE_MOVEMENT_SPEED = 0.0001
export const BASE_SPEED_CHANGE = 0.12
export const BASE_ANGLE_CHANGE = 0.02
export const MAX_HP = 5
export const MAX_WEIGHT = 18
export const ENEMY_BUFFER = 240
export const PLAYER_BUFFER = 300
export const ATTACK_RANGE = 900

const iToType = (t) => ({
  size: t[0],
  size2: t[1],
  health: t[2],
  damage: t[3],
  weight: t[4],
  value: t[5],
  color: t[6],
  image: t[7],
  name: t[7],
})
const iToWave = (l) => ({ count: l[0], progress: l[1] })
const iToLevel = (l) => ({
  x: l[0],
  y: l[1],
  name: l[2],
  len: l[3],
  waves: l[4],
  items: l[5],
  market: l[6],
})

const gem = iToType([32, 32, 10, 1, 0.2, 100, '#fff', 'gem'])
const axe = iToType([32, 64, 10, 10, 0.9, 25, '#fff', 'axe'])
const ingot = iToType([32, 64, 10, 15, 1.3, 10, '#fff', 'ingot'])
export const ITEM_TYPES = {
  empty: iToType([0, 0, 0, 0, 0, 0, '#000', 'empty']),
  rock: iToType([20, 20, 10, 5, 0.7, 1, '#666', 'rock']),
}
export const GEM_TYPES = {
  topaz: ['#ff0', 0.5],
  amethyst: ['#f0f', 1],
  emerald: ['#0f0', 1.5],
  sapphire: ['#00f', 2],
  ruby: ['#f00', 3],
  diamond: ['#0ff', 4],
}

const METAL_TYPES = {
  copper: ['#fa0', 1, 1],
  silver: ['#aaa', 2, 2],
  gold: ['#ff0', 5, 3],
}
Object.entries(GEM_TYPES).forEach(([k, v]) => {
  const t = gem
  ITEM_TYPES[k] = {
    ...t,
    image: 'gem',
    name: k,
    // @ts-ignore
    value: t.value * v[1],
    color: v[0],
  }
})
Object.entries(METAL_TYPES).forEach(([k, v]) => {
  const t = ingot
  const a = axe
  ITEM_TYPES[k + '-ingot'] = {
    ...t,
    name: k + '-ingot',
    image: 'ingot',
    // @ts-ignore
    value: t.value * v[1],
    // @ts-ignore
    damage: t.damage * v[2],
    color: v[0],
  }
  ITEM_TYPES[k + '-axe'] = {
    ...a,
    name: k + '-axe',
    image: 'axe',
    // @ts-ignore
    value: a.value * v[1],
    // @ts-ignore
    damage: t.damage * v[2],
    color: v[0],
  }
})

export const LEVELS = [
  iToLevel([50, 260, 'ISKENDERUN', 0.75]),
  iToLevel([245, 400, 'BAGHDAD', 1]),
  iToLevel([412, 330, 'TEHRAN', 1.25]),
  iToLevel([645, 325, 'MASHHAD', 1.5]),
  iToLevel([908, 380, 'KABEL', 1.75]),
  iToLevel([1080, 195, 'KASHI', 1.75]),
]
