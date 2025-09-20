import { Obstacles, Physics, Resource, ResourceNMap } from '@/core/ecs/component'
import { weightedRandom } from '@/lib/utils'

export const ResourcePhysics: Record<Resource, Physics> = {
  [Resource.wood]: { mass: 50, friction: 0.94 },
  [Resource.food]: { mass: 40, friction: 0.96 },
  [Resource.barrel]: { mass: 150, friction: 0.94 },
  [Resource.box]: { mass: 200, friction: 0.94 },
  [Resource.water]: { mass: 35, friction: 0.96 }
}
export const MovingObstaclesPhysics: Record<Obstacles, Physics> = {
  [Obstacles.anvil]: { mass: 400, friction: 0.7 },
  [Obstacles.wagon]: { mass: 400, friction: 0.9 }
}

export const ResourcesPrices: Record<Resource, number> = {
  [Resource.wood]: 3,
  [Resource.food]: 1,
  [Resource.barrel]: 11,
  [Resource.box]: 6,
  [Resource.water]: 2
}

type ResourceByLevel = {
  [key in 0|1|2|3]: {
    resources: Resource[]
    weights: number[]
    max: number
  }
}
const resourcesByLevel: ResourceByLevel = {
  0: {
    resources: [Resource.food, Resource.water, Resource.wood],
    weights: [0.5, 0.3, 0.2],
    max: 2
  },
  1: {
    resources: [Resource.food, Resource.water, Resource.wood, Resource.box],
    weights: [0.3, 0.3, 0.3, 0.1],
    max: 3
  },
  2: {
    resources: [Resource.food, Resource.water, Resource.wood, Resource.box, Resource.barrel],
    weights: [0.2, 0.1, 0.2, 0.2, 0.3],
    max: 4
  },
  3: {
    resources: [Resource.barrel, Resource.box],
    weights: [0.6, 0.4],
    max: 2
  }
}

export const getLevelResources = (level: 1|2|3|0) => {
  // @ts-ignore
  const { resources, weights, max } = resourcesByLevel[level]
  // random from 1 to max
  const amount = Math.floor(Math.random() * max) + 1

  const resList: ResourceNMap = {}
  for (let i = 0; i < amount; i++) {
    const r = resources[weightedRandom(weights)]
    // @ts-ignore
    resList[r] = (resList[r] || 0) + 1
  }
  return resList
}
