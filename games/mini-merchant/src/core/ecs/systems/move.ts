/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Clickable,
  Draggable,
  Mov,
  Physical,
  Position
} from '../component'
import { controls } from '@/core/controls'
import { Events } from '../events'
import { nthRoot } from '@/lib/utils'

// can be part of move system?
export class PhysicsSystem extends System {
  componentsRequired = new Set<Function>([Mov, Physical])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const phys = comps.get(Physical)

      const defaultFriction = 0.95
      mov.dx *= phys.data.friction || defaultFriction
      mov.dy *= phys.data.friction || defaultFriction
    }
  }
}

export class MoveSystem extends System {
  componentsRequired = new Set<Function>([Mov, Position])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const pos = comps.get(Position)

      pos.x += mov.dx
      pos.y += mov.dy

      // stops if value is too small
      if (Math.abs(mov.dx) < 0.01) {
        mov.dx = 0
      }
      if (Math.abs(mov.dy) < 0.01) {
        mov.dy = 0
      }
    }
  }
}

export class DragSystem extends System {
  componentsRequired = new Set<Function>([Mov, Position, Draggable, Clickable])
  dragging = -1
  draggingForce = 2 // less is better
  inited = false

  init (): void {
    this.ecs.ee.on(Events.gymDone, (entity: Entity) => {
      this.draggingForce -= 0.45
      this.ecs.ee.emit(Events.gether)
    })

    this.inited = true
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
    }
    const mousePos = controls.mousePosition

    if (this.dragging !== -1) {
      const c = this.ecs.getComponents(this.dragging)
      if (!c) {
        this.dragging = -1
      }
    }

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Position)
      const drag = comps.get(Draggable)
      const cl = comps.get(Clickable)

      if (cl.hovered && !drag.dragging && this.dragging === -1) {
        if (controls.isMouseDown) {
          drag.dragging = true
          this.ecs.ee.emit(Events.pickup, entity)
          this.dragging = entity
        }
      }

      if (!controls.isMouseDown && drag.dragging) {
        drag.dragging = false
        this.ecs.ee.emit(Events.drop, entity)
        this.dragging = -1
      }

      if (drag.dragging) {
        // const maxTension = 100
        const mov = comps.get(Mov)
        const ph = comps.get(Physical)
        const m = (ph.data.mass || 50) * this.draggingForce

        const dx = nthRoot(mousePos.x - pos.x, 2)
        const dy = nthRoot(mousePos.y - pos.y, 2)

        // dx = dx > 0 ? Math.min(dx, maxTension) : Math.max(dx, -maxTension)
        // dy = dy > 0 ? Math.min(dy, maxTension) : Math.max(dy, -maxTension)

        mov.dx += dx / m // FIXME: use mass and mouse force
        mov.dy += dy / m
      }
    }
  }
}
