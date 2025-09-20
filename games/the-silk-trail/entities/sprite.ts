import { emit, lerp } from 'kontra'
import { SpriteClass } from 'kontra'
import { GROUND_Y } from '../constants'

export class Sprite extends SpriteClass {
  health: number

  constructor(properties: any = {}) {
    super({ anchor: { x: 0.5, y: 1 }, ...properties })
    this.health = properties?.health || 10
    this._frame = 0
  }

  hurt(n) {
    if (this.health <= 0 || this.color === '#f00') return

    if (n > 0) this.health -= n
    this.color = '#f00'
    emit('delay', 'unhurt', 20, () => {
      this.color = '#fff'
    })
    if (this.health <= 0) this.die()
  }

  die() {
    this.ttl = 0
    this.opacity = 0
  }

  svg(
    _path: string,
    strokeStyle?: string,
    fillStyle?: string,
    lineWidth = 1,
    x = 0,
    y = 0,
  ) {
    let path = new Path2D(_path)
    this.context.translate(x, y)
    if (fillStyle) {
      this.context.fillStyle = fillStyle
      this.context.fill(path)
    }
    if (strokeStyle) {
      this.context.strokeStyle = strokeStyle
      this.context.lineWidth = lineWidth
      this.context.stroke(path)
    }
    this.context.translate(-x, -y)
  }

  drawShadow() {
    this.context.lineWidth = 1
    this.context.beginPath()
    const y = -this.y + this.height * 0.5
    const s = lerp(this.width / 2, 5, (y + GROUND_Y) / 300)
    this.context.fillStyle = `rgba(0,0,0,${lerp(0.4, 0, (y + GROUND_Y) / 300)})`
    this.context.ellipse(this.width / 2, y + GROUND_Y, s, 3, 0, 0, Math.PI * 2)
    this.context.closePath()
    this.context.fill()
  }
  drawDebug() {
    // return
    // this.context.strokeStyle = '#0f0'
    // this.context.lineWidth = 1
    // this.context.beginPath()
    // let x = this.width * -this.anchor.x
    // let y = this.height * -this.anchor.y
    // this.context.rect(0, 0, this.width, this.height)
    // this.context.closePath()
    // this.context.stroke()
    // this.context.fillStyle = '#f00'
    // this.context.strokeStyle = '#fff'
    // this.context.lineWidth = 1
    // this.context.beginPath()
    // this.context.rect(-2.5 + x * -1, -2.5 + y * -1, 5, 5)
    // this.context.closePath()
    // this.context.stroke()
    // this.context.fill()
  }

  update(dt?: number) {
    super.update(dt)
    this._frame++
  }

  render() {
    super.render()
  }
}
