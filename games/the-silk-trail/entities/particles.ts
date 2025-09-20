import { Pool } from 'kontra'
import { Sprite } from './sprite'

export const Particles = () => {
  let pool = Pool({ create: () => new Particle() })
  return {
    pool,
    spawn({ x, y, size = 1, ttl = 50, opacity = 1 }) {
      pool.get({ x, y, width: size, ttl, opacity, io: opacity })
    },
  }
}

class Particle extends Sprite {
  constructor(properties = {}) {
    super({ ...properties })
  }

  update() {
    super.update()
    this.opacity -= this.io / this.ttl
  }

  draw() {
    this.context.beginPath()
    this.context.arc(
      -this.width / 2,
      -this.width / 2,
      this.width,
      0,
      Math.PI * 2,
    )
    this.context.fillStyle = `rgba(255,255,255,${this.opacity})`
    this.context.closePath()
    this.context.fill()
  }
}
