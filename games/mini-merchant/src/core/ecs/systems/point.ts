import { Entity, System } from '@/lib/ecs'
import { Draggable, FloorPoint, PointType, Position, Sellable } from '../component'
import { isPointerIn } from '@/lib/physics'
import { Events } from '../events'
import { tileSizeUpscaled } from '@/params/pixels'

export class PointSystem extends System {
  componentsRequired = new Set<Function>([Sellable])

  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const floor = comps.get(FloorPoint)

      if (!floor) {
        continue
      }
      floor.occupiedBy = -1

      for (const other of entities) {
        if (other === entity || this.ecs.getComponents(other).get(Sellable).type === PointType.sellPoint) {
          continue
        }

        const pos = comps.get(Position)
        const otherPos = this.ecs.getComponents(other).get(Position)

        const isOn = isPointerIn({
          x: pos.x + tileSizeUpscaled / 2,
          y: pos.y + tileSizeUpscaled / 2
        },
        {
          x: otherPos.x,
          y: otherPos.y,
          w: tileSizeUpscaled,
          h: tileSizeUpscaled
        }
        )

        if (isOn) {
          floor.occupiedBy = other
        }
      }

      if (floor.occupiedBy !== -1) {
      // sell
        if (floor.type === PointType.sellPoint) {
          this.ecs.ee.emit(Events.sell, floor.occupiedBy)
        }
        if (floor.type === PointType.factoryPoint) {
          this.ecs.ee.emit(Events.factoryProvideRes, entity, floor.occupiedBy)
        }
      }

      // spawn
      // if (floor.type === 'spawnPoint') {
      //   if (floor.timers.nextSpawn) {
      //     floor.timers.nextSpawn -= this.ecs.currentDelta

      //     if (floor.timers.nextSpawn <= 0) {
      //       floor.timers.nextSpawn = floor.timers.spawnInterval
      //     }
      //   }
      // }
    }
  }
}
