// eslint-disable-next-line max-classes-per-file
import { Component, Entity } from '@/lib/ecs'
import { Layers } from './systems/render'
import { GAME_ROUND } from '@/params/main'

export const enum Resource {
  wood,
  food,
  box,
  water,
  barrel
}

export const enum Obstacles {
  anvil,
  wagon
}

export class GameData extends Component {
  timeLeft = GAME_ROUND
  level = 0
  constructor (public money: number) {
    super()
  }
}

export class Position extends Component {
  constructor (public x: number, public y: number) {
    super()
  }
}

export class Mov extends Component {
  constructor (public dx = 0, public dy = 0) {
    super()
  }
}

export class Renderable extends Component {
  constructor (
    public sprite: number | undefined | [number, number],
    public layer: Layers,
    public visible: boolean = true,
    public carry: number|null = null
  ) {
    super()
  }
}

export interface Physics {
  mass?: number;
  friction?: number;
}

export class Physical extends Component {
  constructor (public data: Physics) {
    super()
  }
}

export class Collidable extends Component {
  constructor (public wh: { w:number, h: number }, public aiObstacle: boolean = false) {
    super()
  }
}

export class Aible extends Component {
}

export class Draggable extends Component {
  constructor (
    public draggable: boolean = true,
    public dragging: boolean = false,
    public hovered: boolean = false
  ) {
    super()
  }
}

export const enum PointType {
  sellPoint = 90,
  factoryPoint = 91,
}

export class FloorPoint extends Component {
  constructor (public type: PointType, public occupiedBy: number = -1, public bindedTo: number = -1) {
    super()
  }
}

export type SellObjectType = Resource | PointType;
export class Sellable extends Component {
  constructor (public type: SellObjectType, public price: number = -1) {
    super()
  }
}

// interface SpawnTimer {
//   nextSpawn?: number;
//   spawnInterval?: number;
//   whatToSpawn?: EntityType;
// }

// export class SpawnPoint extends Component {
//   constructor (public timer: SpawnTimer) {
//     super()
//   }
// }

interface PhysicsModifiers {
  frictionMulti?: number;
  massMulti?: number;
  dx?: number;
  dy?: number;
}

export class FloorModifier extends Component {
  constructor (public physicsModifiers: PhysicsModifiers) {
    super()
  }
}

export class Particle extends Component {
  constructor (
    public lifeTime: number,
    public size: number,
    public color: string,
    public sprite?: number
  ) {
    super()
  }
}

// @ts-ignore
export type ResourceNMap = { [key: Resource]: number };

export const enum BuyerState {
  walking,
  buying,
  inQ,
  walkingBack
}
export class Buyer extends Component {
  constructor (public resToBuy: ResourceNMap = {}, public time: number, public targetPos: [number, number], public queuePos: number = -1, public state: BuyerState = BuyerState.walking, public bought: boolean = false) {
    super()
  }
}

export class ResourceFactory extends Component {
  resNeededCurState: ResourceNMap | null = null
  constructor (public type: Resource, public resNeeded: ResourceNMap) {
    super()
  }
}

export class ResourceSource extends Component {
  constructor (public type: Resource, public needResource: ResourceNMap = {}, public interval: number = 0, public nextIn: number = 0) {
    super()
  }
}

export const enum ClickableType {
  Hire,
  Gym,
  Help,
  Resource,
}
export class Clickable extends Component {
  hovered: boolean = false
  enabled: boolean = true
  constructor (public icon: number | [number, number], public withTop: boolean = false, public text?: string, public type?: ClickableType) {
    super()
  }
}

export const enum AIState {
  idle,
  toTarget,
  toBase
}

export class AI extends Component {
  state: AIState = AIState.idle
  targetPos: [number, number] | null = null
  targetEntity: Entity|null = null
  pickedUp: boolean = false
  constructor (public isFriendly: boolean = true) {
    super()
  }
}
