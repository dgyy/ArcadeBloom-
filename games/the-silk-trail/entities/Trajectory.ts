import { emit, Pool } from 'kontra'
import { GRAVITY, GROUND_Y } from '../constants'
import { Sprite } from './sprite'

export class Trajectory {
  sprites: Pool
  as: AngleSprite
  ts: TrajectorySprite
  speed: number
  stage: number
  angle: number

  constructor(properties) {
    this.ts = new TrajectorySprite(properties)
    this.as = new AngleSprite(properties)
    this.stage = 0
    this.speed = properties.speed
    this.angle = properties.angle
  }

  update() {
    if (this.stage === 0) return

    this.as.angle = this.angle
    this.as.speed = this.speed
    this.as.update()

    this.ts.angle = this.angle
    this.ts.speed = this.speed
    this.ts.update()
  }

  render() {
    if (this.stage === 0) return
    this.as.render()
    this.ts.render()
  }
}
class AngleSprite extends Sprite {
  constructor(properties = {}) {
    super({
      anchor: { x: 0, y: 0 },
      ...properties,
    })
  }

  update(dt?) {
    super.update(dt)
  }

  draw() {
    const s = 0
    const d = 50 + 50 * ((this.speed - 4) / 11)

    this.context.beginPath()
    this.context.lineWidth = 10
    this.context.strokeStyle = `#000`
    this.context.moveTo(s * Math.cos(this.angle), s * Math.sin(this.angle))
    this.context.lineTo(
      (s + d) * Math.cos(this.angle),
      (s + d) * Math.sin(this.angle),
    )
    this.context.stroke()
  }
}
class TrajectorySprite extends Sprite {
  constructor(properties = {}) {
    super({
      anchor: { x: 0, y: 0 },
      ...properties,
    })
  }

  update(dt?) {
    super.update(dt)
  }

  draw() {
    const size = 8
    let x = 0
    let y = 0
    let dx = this.speed * Math.cos(this.angle)
    let dy = this.speed * Math.sin(this.angle)
    let o = 0.4
    for (let i = 0; i < 200; i++) {
      x += dx
      y += dy
      dy += GRAVITY
      // this.ddy = GRAVITY
      if (y + 280 > GROUND_Y) break
      if (i % 4 !== 0) continue
      o -= 0.02
      this.context.beginPath()
      this.context.fillStyle = `rgba(255,255,255,${o})`
      this.context.arc(x, y, size / 2, 0, Math.PI * 2)
      this.context.closePath()
      this.context.fill()
    }
  }
}
