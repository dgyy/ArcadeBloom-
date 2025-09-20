/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Clickable,
  ClickableType,
  Mov,
  Position,
  ResourceSource
} from '../component'
import { controls } from '../../controls'
import {
  isPointerIn
} from '@/lib/physics'
import { createFreight } from '../helpers'
import { Events } from '../events'
import { tileSizeUpscaled } from '@/params/pixels'

export class ClickSystem extends System {
  componentsRequired = new Set<Function>([Clickable, Position])
  prevMouse = false
  nextClickIn = 0
  clickTime = 500

  click (entity: Entity): void {
    const comps = this.ecs.getComponents(entity)

    const resS = comps.get(ResourceSource)
    const pos = comps.get(Position)
    const clk = comps.get(Clickable)

    if (resS?.nextIn <= 0) {
      const e = this.ecs.addEntity()

      createFreight([pos.x, pos.y + tileSizeUpscaled], resS.type).forEach((c) => {
        this.ecs.addComponent(e, c)
      })
      const mov = this.ecs.getComponents(e).get(Mov)
      mov.dx = 0
      mov.dy = 1.5

      this.ecs.ee.emit(Events.gether, entity)
      resS.nextIn = resS.interval
    }

    if (clk.type === ClickableType.Hire) {
      this.ecs.ee.emit(Events.hire, entity)
    }
    if (clk.type === ClickableType.Gym) {
      this.ecs.ee.emit(Events.gym, entity)
    }
  }

  update (entities: Set<Entity>): void {
    const mousePos = controls.mousePosition

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Position)
      const cl = comps.get(Clickable)

      cl.hovered = isPointerIn(mousePos, {
        x: pos.x,
        y: cl.withTop ? pos.y - tileSizeUpscaled : pos.y,
        w: tileSizeUpscaled,
        h: cl.withTop ? tileSizeUpscaled * 2 : tileSizeUpscaled
      })

      if (cl.hovered && this.prevMouse !== controls.isMouseDown) {
        if (this.nextClickIn <= 0 && cl.enabled) {
          this.click(entity)
          this.nextClickIn = this.clickTime
        }
      }

      const resS = comps.get(ResourceSource)
      if (resS?.nextIn > 0) {
        resS.nextIn -= this.ecs.currentDelta
      }
    }

    if (this.nextClickIn > 0) {
      this.nextClickIn -= this.ecs.currentDelta
    }

    this.prevMouse = controls.isMouseDown
  }
}
