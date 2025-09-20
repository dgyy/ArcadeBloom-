import { Entity, System } from '@/lib/ecs'
import { Buyer, BuyerState, Clickable, GameData, Position, Renderable, Sellable, SellObjectType } from '../component'
import { Layers } from './render'
import { SACK } from '@/tiles'
import { Events } from '../events'
import { createAI, createBuyer } from '../helpers'
import { GAME_ROUND, GYM_PRICE, HIRE_PRICE, INITIAL_MONEY, MAX_GYM, MAX_HIRE, intervalForCustomer, levelsByTime, timeForCustomer } from '@/params/main'
import { getGridPointInPixels } from '@/lib/grid'
import { getLevelResources } from '@/params/resources'

const posStart = [24, 22]
const posEnd: [number, number] = [21, 22]
const qPosEnd: [number, number] = [24, 14]
const qPosStart: [number, number] = [21, 14]
const maxBuyers = 4
const intervalMove = 30

export class SellSystem extends System {
  inited = false

  bSpeed = 2 // only odd numbers

  q:Entity[] = []

  next = 0
  nextMove = 0
  level = 0

  componentsRequired = new Set<Function>([Buyer, Position])
  init (): void {
    this.ecs.ee.on(Events.nextLevel, (level: number) => {
      this.level = level
    })

    // sell event
    this.ecs.ee.on(Events.sell, (entity: Entity) => {
      const comps = this.ecs.getComponents(entity)
      const sell = comps.get(Sellable)

      if (!sell) {
        return
      }

      if (this.q.length) {
        const b = this.q[0]
        const buyerComp = this.ecs.getComponents(b)
        const buyer = buyerComp.get(Buyer)
        if (buyer.state !== BuyerState.buying) {
          return
        }
        // @ts-ignore
        if ((buyer.resToBuy[sell.type] || 0) > 0) {
          this.ecs.ee.emit(Events.sold, entity, sell.price)
          // @ts-ignore
          buyer.resToBuy[sell.type] -= 1
          buyer.bought = true
          const isEverythingProvided = Object.values(buyer.resToBuy).every((v) => v === 0)
          if (isEverythingProvided) {
            // tip
            // random 1-2
            this.ecs.ee.emit(Events.sold, entity, Math.floor(Math.random() * 2) + 1)
            this.leaveQ(b)
          }
          // console.log(buyer, sell.type, buyer.resToBuy[sell.type])
          this.ecs.removeEntity(entity)
        } else {
          this.ecs.ee.emit(Events.notSold, entity)
        }
      }
    })
  }

  createBuyer (): void {
    const buyer = this.ecs.addEntity()
    const resList = getLevelResources(this.level as 0|1|2|3)
    createBuyer(getGridPointInPixels(posStart[0], posStart[1]),
      resList, timeForCustomer[this.level], qPosEnd).forEach(c =>
      this.ecs.addComponent(buyer, c)
    )
  }

  qCheck (entity: Entity): void {
    let position = 0
    if (this.q.includes(entity)) {
      position = this.q.indexOf(entity)
    } else {
      position = this.q.length
      this.q.push(entity)
    }

    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)

    // position updated
    if (buyer.queuePos !== position) {
      buyer.queuePos = position
      buyer.state = BuyerState.walking
      buyer.targetPos = [qPosStart[0] + position, qPosStart[1]]
    }

    const pos = comp.get(Position)
    const tPos = getGridPointInPixels(...buyer.targetPos)
    const isOnTarget = pos.x === tPos[0] && pos.y === tPos[1]
    if (isOnTarget) {
      if (position === 0) {
        buyer.state = BuyerState.buying
        this.ecs.ee.emit(Events.newCustomer, entity)
      } else {
        buyer.state = BuyerState.inQ
      }
    }
  }

  moveBuyer (entity: Entity): void {
    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)
    const pos = comp.get(Position)

    const [x, y] = buyer.targetPos
    const [bx, by] = getGridPointInPixels(x, y)
    if (pos.x === bx && pos.y === by) {
      if (buyer.state === BuyerState.walking) {
        this.qCheck(entity)
      }
      if (buyer.state === BuyerState.walkingBack) {
        this.ecs.removeEntity(entity)
      }
    } else {
      if (pos.x < bx) {
        pos.x += this.bSpeed
      }
      if (pos.x > bx) {
        pos.x -= this.bSpeed
      }
      if (pos.y < by) {
        pos.y += this.bSpeed
      }
      if (pos.y > by) {
        pos.y -= this.bSpeed
      }
    }
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }

    // create
    this.next -= this.ecs.currentDelta
    if (this.next <= 0) {
      this.next = intervalForCustomer[this.level]
      if (entities.size < maxBuyers) {
        this.createBuyer()
      }
    }

    // move
    this.nextMove -= this.ecs.currentDelta
    if (this.nextMove <= 0) {
      this.nextMove = intervalMove
      for (const entity of entities) {
        const comps = this.ecs.getComponents(entity)
        const buyer = comps.get(Buyer)
        if (buyer.state === BuyerState.walking || buyer.state === BuyerState.walkingBack) {
          this.moveBuyer(entity)
        }
        if (buyer.state === BuyerState.inQ) {
          this.qCheck(entity)
        }
      }
    }

    // update time for buyers
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const buyer = comps.get(Buyer)
      if (buyer.state === BuyerState.buying) {
        buyer.time -= this.ecs.currentDelta
        if (buyer.time <= 0) {
          this.leaveQ(entity)
        }
      }
    }
  }

  leaveQ (entity: Entity): void {
    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)
    buyer.state = BuyerState.walkingBack
    buyer.targetPos = posEnd
    this.q.shift()
    if (buyer.bought) {
      const r = comp.get(Renderable)
      r.carry = SACK
    }
  }
}

export class GameDataSystem extends System {
  componentsRequired = new Set<Function>([GameData])

  inited = false
  e: Entity = -1
  hired = 0
  gymed = 0

  init (): void {
    this.e = this.ecs.addEntity()
    this.ecs.addComponent(this.e, new GameData(INITIAL_MONEY))
    this.ecs.addComponent(this.e, new Renderable(undefined, Layers.UI))

    this.ecs.ee.on(Events.sold, (entity: Entity, price: number) => {
      this.ecs.getComponents(this.e).get(GameData).money += price
    })

    this.ecs.ee.on(Events.hire, (entity: Entity) => {
      const gd = this.ecs.getComponents(this.e).get(GameData)
      if (this.hired < MAX_HIRE && gd.money >= HIRE_PRICE) {
        const e = this.ecs.addEntity()
        createAI(getGridPointInPixels(15, 15), true).forEach(c =>
          this.ecs.addComponent(e, c)
        )
        gd.money -= HIRE_PRICE
        this.hired += 1
        this.ecs.ee.emit(Events.gether, entity)

        if (this.hired === MAX_HIRE) {
          this.ecs.getComponents(entity).get(Clickable).enabled = false
        }
      } else {
        this.ecs.ee.emit(Events.notSold, entity) // FIXME hack
      }
    })

    this.ecs.ee.on(Events.gym, (entity: Entity) => {
      const gd = this.ecs.getComponents(this.e).get(GameData)
      if (gd.money >= GYM_PRICE && this.gymed < MAX_GYM) {
        gd.money -= GYM_PRICE
        this.gymed += 1

        if (this.gymed === MAX_GYM) {
          this.ecs.getComponents(entity).get(Clickable).enabled = false
        }
        this.ecs.ee.emit(Events.gymDone, entity)
      } else {
        this.ecs.ee.emit(Events.notSold, entity) // FIXME hack
      }
    })

    this.inited = true
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
    }

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const gameData = comps.get(GameData)

      gameData.timeLeft -= this.ecs.currentDelta

      if (gameData.timeLeft <= 0) {
        this.ecs.ee.emit(Events.gameOver, gameData.money)
      }
      // check level
      const maxLevel = levelsByTime.length - 1
      if (gameData.level + 1 < maxLevel) {
        if (levelsByTime[gameData.level + 1] < GAME_ROUND - gameData.timeLeft) {
          gameData.level++
          this.ecs.ee.emit(Events.nextLevel, gameData.level)
        }
      }
    }
  }
}
