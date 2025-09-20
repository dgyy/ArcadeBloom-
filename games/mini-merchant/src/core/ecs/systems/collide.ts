import { Entity, System } from '@/lib/ecs'
import { correctAABBCollision, testAABBCollision } from '@/lib/physics'
import { Collidable, Draggable, Mov, Position } from '../component'
import { Events } from '../events'
import { tileSizeUpscaled } from '@/params/pixels'

// return x,y of the hitbox from center
export const getColPos = (pos: {x:number, y:number}, wh: {w:number, h:number}): Position => {
  return {
    x: pos.x + ((tileSizeUpscaled - wh.w) / 2),
    y: pos.y + ((tileSizeUpscaled - wh.h) / 2)
  }
}

export class CollideSystem extends System {
  componentsRequired = new Set<Function>([Position, Collidable])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      // check only mov
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const col = comps.get(Collidable)
      if (!mov) {
        continue
      }
      const { wh } = comps.get(Collidable)
      const pos = getColPos(comps.get(Position), wh)

      for (const other of entities) {
        if (other === entity) {
          continue
        }

        const otherComps = this.ecs.getComponents(other)
        const otherCol = otherComps.get(Collidable)
        const otherPos = getColPos(otherComps.get(Position), otherCol.wh)
        const t = testAABBCollision(
          pos,
          col.wh, // FIXME: implement and use w ,h from col
          otherPos,
          otherCol.wh
        )

        if (t.collide) {
          const otherMov = otherComps.get(Mov)
          if (comps.get(Draggable)?.dragging) {
            this.ecs.ee.emit(Events.collide, entity, other)
          }

          correctAABBCollision(
            { mov, pos, col },
            { mov: otherMov, pos: otherPos, col: otherCol },
            t
          )
        }
      }
    }
  }
}
