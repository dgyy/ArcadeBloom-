import { Entity, System } from '@/lib/ecs'
import { Position, ResourceFactory, Sellable } from '../component'
import { Events } from '../events'
import { createFreight } from '../helpers'
import { tileSizeUpscaled } from '@/params/pixels'

export class ResourceFactorySystem extends System {
  componentsRequired = new Set<Function>([ResourceFactory])

  inited = false

  produceRes (entity: Entity): void {
    const comps = this.ecs.getComponents(entity)
    const factory = comps.get(ResourceFactory)
    const pos = comps.get(Position)

    const e = this.ecs.addEntity()
    createFreight([pos.x, pos.y + tileSizeUpscaled], factory.type).forEach((c) => {
      this.ecs.addComponent(e, c)
    })

    factory.resNeededCurState = { ...factory.resNeeded }
  }

  init (): void {
    this.ecs.ee.on(Events.factoryProvideRes, (factory: Entity, res: Entity) => {
      const fComps = this.ecs.getComponents(factory)
      const f = fComps.get(ResourceFactory)
      if (!f.resNeededCurState) {
        f.resNeededCurState = { ...f.resNeeded }
      }

      const rComps = this.ecs.getComponents(res)
      const rSell = rComps.get(Sellable)
      // FIXMIE possible sell sellpoint
      // @ts-ignore
      if (f.resNeededCurState[rSell.type] > 0) {
      // @ts-ignore
        f.resNeededCurState[rSell.type] -= 1
        this.ecs.removeEntity(res)
      } else {
        this.ecs.ee.emit(Events.notSold, res)
      }

      const eveytingIsProvided = Object.values(f.resNeededCurState).every((v) => v === 0)
      if (eveytingIsProvided) {
        this.produceRes(factory)
      }
    })
    this.inited = true
  }

  update (entities: Set<number>): void {
    if (!this.inited) {
      this.init()
    }

    // for (const entity of entities) {
    //   const comps = this.ecs.getComponents(entity)
    //   const point = comps.get(FloorPoint)
    //   const factory = comps.get(ResourceFactory)
    // }
  }
}
