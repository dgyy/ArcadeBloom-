// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'
import { Layers } from './core/ecs/systems/render'

export const WAGON = 24
export const ANVIL = 51
export const SACK = 46
export const FOOD = [SACK, 7] as [number, number]
export const GRASS = 0
export const CITIZENS = [53, 55, 57, 54]
export const P_SELL = 47
export const P_SPAWN = 48
export const TREE_BOTTOM = 6
export const TREE_TOP = 2
export const WELL_BOTTOM = 44
export const WELL_TOP = 42
export const CROP = 7

export const I_ARROW_HAND = 62
export const I_FIST_HAND = 63
export const I_PICKUP_HAND = 64

export const I_COIN = 43

export const SIGN = 39

export const CYCLOP = 56
export const CRAB = 57

export const DOOR = 41

// @ts-ignore
export const resourcesSprites: Record<Resource, number| [number, number]> = {
  [Resource.wood]: 45,
  [Resource.box]: 49,
  [Resource.food]: FOOD,
  [Resource.barrel]: 52,
  [Resource.water]: 58
}

export const convertResToSprite = (res: Resource): number| [number, number] => {
  return resourcesSprites[res]
}

// @ts-ignore
export type MapSchema = {[key: Layers]: [
  number, // sprite
  number, // y
  number, // x
][]}

export const getMap = (): MapSchema => {
  return { 0: t.default['0'], 3: t.default['3'], 4: t.default['4'] }
}
