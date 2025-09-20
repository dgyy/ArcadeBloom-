import { Entity, System } from '@/lib/ecs'
import { Mov, Particle, Position, Renderable, SellObjectType } from '../component'
import { Layers } from './render'
import { I_COIN } from '@/tiles'
import { Events } from '../events'
import { tileSizeUpscaled } from '@/params/pixels'

export class ParticleSystem extends System {
  inited = false
  nextTick = 0
  tick = 200

  componentsRequired = new Set<Function>([Position, Mov])

  init (): void {
    this.ecs.ee.on(Events.collide, (entity: Entity, other :Entity) => {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Position)

      const otherComps = this.ecs.getComponents(other)
      const otherPos = otherComps.get(Position)

      // find center of the collision
      const impactPoint = {
        x: (pos.x + otherPos.x) / 2,
        y: (pos.y + otherPos.y) / 2 - tileSizeUpscaled / 2
      }

      // random 3-6 particles
      const count = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < count; i++) {
        this.createParticle(impactPoint, undefined, i, 'white')
      }
    })

    this.ecs.ee.on(Events.sold, (entity: Entity, price: number, type?: SellObjectType) => {
      // random N particles
      const count = price
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Position)
      // console.log('sold', count, pos)

      for (let i = 0; i < count; i++) {
        this.createParticle(pos, { dx: 0, dy: -5 }, i, 'gold', I_COIN, 2500)
      }
    })
  }

  createParticle (pos: Position, mov: Mov|undefined, i: number, color: string, sprite?: number, time = 500): void {
    const e = this.ecs.addEntity()
    i = Math.min(i, 5)
    this.ecs.addComponent(e, new Position(pos.x + tileSizeUpscaled / 2 + i, pos.y + tileSizeUpscaled - 2))
    // randomise dx, dy a bit to make it more interesting and limit the speed by 0.5
    const dx = (Math.random() - 0.5) / 2 + (mov?.dx || 0)
    const dy = (Math.random() - 0.5) / 2 + (mov?.dy || 0)
    this.ecs.addComponent(e, new Mov(dx, dy))
    // color should be transparent
    this.ecs.addComponent(e, new Particle(time, 3, color, sprite))
    this.ecs.addComponent(e, new Renderable(undefined, Layers.Effects))
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }

    // This is ground particle system, creates dirt for every moving entity
    this.nextTick -= this.ecs.currentDelta
    if (this.nextTick <= 0) {
      for (const entity of entities) {
        const comps = this.ecs.getComponents(entity)
        const mov = comps.get(Mov)

        const particle = comps.get(Particle)
        if (particle) {
          continue
        }

        if (Math.abs(mov.dx) > 0.2 || Math.abs(mov.dy) > 0.2) {
          // random 3-6 particles
          const count = Math.floor(Math.random() * 10) + 7
          for (let i = 0; i < count; i++) {
            const pos = comps.get(Position)
            const DIRT_COLOR = 'rgba(145, 79, 25, 0.2)'
            // limit speed to 0.5 -0.5, make it reverse
            const dx = mov.dx > 0 ? -Math.min(mov.dx, 0.5) : -Math.max(mov.dx, -0.5)
            const dy = mov.dy > 0 ? -Math.min(mov.dy, 0.5) : -Math.max(mov.dy, -0.5)
            this.createParticle(pos, { dx, dy }, i, DIRT_COLOR)
          }
        }
      }
      this.nextTick = this.tick
    }

    // remove old
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)

      const particle = comps.get(Particle)
      if (particle) {
        particle.lifeTime -= this.ecs.currentDelta
        if (particle.lifeTime <= 0) {
          this.ecs.removeEntity(entity)
        }
        continue
      }
    }
  }
}
