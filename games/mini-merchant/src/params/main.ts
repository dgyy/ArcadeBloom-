import { getGridPointInPixels } from '@/lib/grid'
import { tileSizeUpscaled } from './pixels'

const xyYard = getGridPointInPixels(15, 4)
export const YARD = {
  x: xyYard[0],
  y: xyYard[1],
  w: 12 * tileSizeUpscaled,
  h: 9 * tileSizeUpscaled
}

export const DROP_POINTS : { [key:string]: number} = {
  '14,5': 1, // TL
  '14,10': 1, // TL
  '19,3': -1, // LT
  '20,3': -1, // RT
  '27,11': 2 // RB
}
export const INITIAL_MONEY = 10
export const HIRE_PRICE = 10
export const MAX_HIRE = 4
export const GYM_PRICE = 4
export const MAX_GYM = 3

export const GAME_ROUND = 7 * 60 * 1000
export const levelsByTime = [
  0, // 1 min
  60 * 2, // 2
  60 * 4, // 4
  60 * 5 // 5
].map(x => x * 1000)

export const timeForCustomer = [
  40, // 0 lvl
  35, // 1 lvl
  30, // 2 lvl
  30 // 3 lvl
].map(x => x * 1000)

export const intervalForCustomer = [
  23, // 0 lvl
  18, // 1 lvl
  15, // 2 lvl
  10 // 3 lvl
].map(x => x * 1000)

export const GAME_PREFIX = 'rndd_mm'
