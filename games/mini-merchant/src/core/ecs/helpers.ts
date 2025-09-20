import { Component, Entity } from '@/lib/ecs'
import {
  AI,
  Aible,
  Buyer,
  Clickable,
  ClickableType,
  Collidable,
  Draggable,
  FloorPoint,
  Mov,
  Obstacles,
  Physical,
  PointType,
  Position,
  Renderable,
  Resource,
  ResourceFactory,
  ResourceNMap,
  ResourceSource,
  Sellable
} from './component'
import { Layers } from './systems/render'
import { CRAB, CROP, CYCLOP, DOOR, I_COIN, I_PICKUP_HAND, CITIZENS, P_SELL, SIGN, TREE_BOTTOM, WELL_BOTTOM, convertResToSprite, resourcesSprites, P_SPAWN } from '@/tiles'
import { MovingObstaclesPhysics, ResourcePhysics, ResourcesPrices } from '@/params/resources'
import { randomFromList } from '@/lib/utils'
import { HELP_CYCLOPS_DOOR, HELP_GYM_DOOR } from '@/params/text'
import { tileSizeUpscaled } from '@/params/pixels'

// helper functions to create entities
export const createObstacle = (
  [x, y]: [number, number],
  sprite: number,
  w = tileSizeUpscaled - 4, h = tileSizeUpscaled - 4
  // FIXME remove angle is not used
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w, h }, true),
    new Aible()
  ]
}

export const createMovingObstacle = (
  [x, y]: [number, number],
  sprite: number,
  type: Obstacles,
  w = tileSizeUpscaled - 2, h = tileSizeUpscaled - 2
): Component[] => {
  const ph = MovingObstaclesPhysics[type]

  return [
    new Position(x, y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w, h }, true),
    new Mov(),
    new Physical(ph),
    new Draggable(),
    new Clickable(I_PICKUP_HAND),
    new Aible()
  ]
}

export const createFloor = (
  [x, y]: [number, number],
  sprite: number,
  angle?: number
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(sprite, Layers.Floor)
  ]
}

export const createBuyer = (
  [x, y]: [number, number],
  resToBuy: ResourceNMap,
  timeToBuy: number,
  targetPos: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(randomFromList(CITIZENS), Layers.Objects),
    new Buyer(resToBuy, timeToBuy, targetPos)
  ]
}

export const createAlwaysOnTop = (
  [x, y]: [number, number],
  sprite: number
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(sprite, Layers.AlwaysOnTop)
  ]
}

export const createSign = (
  [x, y]: [number, number],
  text: string
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(SIGN, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new Aible(),
    new Clickable(I_PICKUP_HAND, false, text, ClickableType.Help)
  ]
}

export const createCyclopDoor = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(DOOR, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new Aible(),
    new Clickable(I_COIN, false, HELP_CYCLOPS_DOOR, ClickableType.Hire)
  ]
}

export const createGymDoor = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(DOOR, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new Aible(),
    new Clickable(I_COIN, false, HELP_GYM_DOOR, ClickableType.Gym)
  ]
}

export const createFreight = (
  [x, y]: [number, number],
  resourceType: Resource,
  w = tileSizeUpscaled - 8, h = tileSizeUpscaled - 8,
  physics?: {
    mass: number;
    friction: number;
  },
  price?: number
): Component[] => {
  if (!price) {
    price = ResourcesPrices[resourceType]
  }

  if (!physics) {
    // @ts-ignore
    physics = ResourcePhysics[resourceType]
  }

  // add price
  return [
    new Position(x, y),
    new Renderable(convertResToSprite(resourceType), Layers.Objects),
    new Collidable({ w, h }),
    new Draggable(),
    new Clickable(I_PICKUP_HAND),
    new Mov(),
    new Physical({ mass: physics?.mass, friction: physics?.friction }),
    new Sellable(resourceType, price),
    new Aible()
  ]
}

export const createAI = (
  [x, y]: [number, number],
  isFriendly: boolean,
  w = tileSizeUpscaled - 4, h = tileSizeUpscaled - 4
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(isFriendly ? CYCLOP : CRAB, Layers.Objects),
    new AI(isFriendly),
    new Aible()
    // new Collidable({ w, h })
  ]
}

export const createTree = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(TREE_BOTTOM, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new ResourceSource(Resource.wood, {}, 10000),
    new Clickable(resourcesSprites[Resource.wood], true),
    new Aible()
  ]
}

export const createWell = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(WELL_BOTTOM, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new ResourceSource(Resource.water, {}, 3000),
    new Clickable(resourcesSprites[Resource.water], true),
    new Aible()
  ]
}

export const createCrop = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Position(x, y),
    new Renderable(CROP, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }, true),
    new ResourceSource(Resource.food, {}, 25000),
    new Clickable(resourcesSprites[Resource.food]),
    new Aible()
  ]
}

// Fixme rework it into ecs
// export const createSpawnPoint = (pos: DOMPoint): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite: SPAWN_POINT,
//     type: "spawnPoint",
//     layer: Layers.Points,
//     gameData: {
//       timers: {
//         nextSpawn: 3000,
//         spawnInterval: 5000,
//       },
//     },
//   };
// };

export const createSellPoint = ([x, y]: [number, number]): Component[] => {
  return [
    new Position(x, y),
    new Renderable(P_SELL, Layers.Points),
    new FloorPoint(PointType.sellPoint),
    new Sellable(PointType.sellPoint)
  ]
}

export const createFactoryPoint = ([x, y]: [number, number], resource: Resource, resNeeded: ResourceNMap): Component[] => {
  return [
    new Position(x, y),
    new Renderable(P_SPAWN, Layers.Points),
    new FloorPoint(PointType.factoryPoint),
    new ResourceFactory(resource, resNeeded),
    new Sellable(PointType.factoryPoint)
  ]
}

// export const createModifiedFloor = (
//   pos: DOMPoint,
//   sprite: number,
//   type: "stairs" | "ice",
//   modifiers: Entity["physicsModifiers"]
// ): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite,
//     type: type,
//     layer: Layers.Floor,
//     physicsModifiers: modifiers,
//     gameData: {},
//   };
// };
