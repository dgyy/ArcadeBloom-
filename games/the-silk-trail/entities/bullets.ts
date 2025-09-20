import { Pool } from 'kontra'
import { playSound } from '../utils'
import { GROUND_Y, ITEM_TYPES } from '../constants'
import { Sprite } from './sprite'

export const Bullets = ({ particles }) => {
  let pool = Pool({
    create: () => new Bullet(),
  })

  const spawn = (x: number, y: number, itemKey: string) => {
    if (!ITEM_TYPES[itemKey]) return
    const { health, size, size2, image, damage, color } = ITEM_TYPES[itemKey]
    return pool.get({
      x,
      y,
      damage,
      color,
      health,
      type: image,
      name: itemKey,
      active: false,
      ttl: Infinity,
      isEnemyBullet: false,
      particles,
      width: size,
      height: size,
      size: size2,
      maxHealth: health,
      anchor: { x: 0.5, y: 0.5 },
    }) as Bullet
  }

  const shoot = (
    item: Bullet,
    xSpeed = 0,
    ySpeed = 0,
    angle = 0,
    ddy = 0,
    ttl = Infinity,
    isEnemyBullet = false,
  ) => {
    item.dx = xSpeed * Math.cos(angle)
    item.dy = ySpeed * Math.sin(angle)
    item.ddy = ddy
    item.ttl = ttl
    item.active = true
    item.isEnemyBullet = isEnemyBullet
  }

  return { particles, pool, spawn, shoot }
}

export class Bullet extends Sprite {
  constructor(properties = {}) {
    super(properties)
  }

  init(props) {
    super.init(props)
    this.small = false
  }

  update() {
    if (!this.active) {
      this._frame = 0
      return
    }
    super.update()
    if (this.ttl <= 0) return
    if (this.x < 0 || this.y > GROUND_Y) {
      this.particles?.spawn({
        x: this.x,
        y: this.y,
        size: this.width / 3,
        ttl: 30,
      })
      this.dx = 0
      this.dy = 0
      this.ddy = 0
      this.ttl = 0
      playSound('click')
    }
  }

  draw() {
    const s = this.width / 2
    const s2 = s * -2

    this.small && this.context.scale(0.6, 0.6)
    this.context.translate(s, s)
    this.context.rotate(-(this._frame / 5))
    if (this.type === 'rock') {
      this.context.beginPath()
      this.context.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      this.context.fillStyle = this.color
      this.context.closePath()
      this.context.fill()
      this.context.stroke()
      // } else if (this.type === 'bag') {
      //   this.svg(BAG_STROKE, '#000', this.color, 0, s2, s2)
      //   this.svg('M38 15H29L26 9H40L38 15Z', '#000', this.color, 0, s2, s2)
      //   this.svg('M28 17H38.5', 'transparent', 'red', 0, s * 0.5, s * 0.5)
    } else if (this.type === 'gem') {
      this.svg(GEM_FILL, 'transparent', this.color, 0, s2, s2)
      this.svg(GEM_STROKE, '#000', 'transparent', 0, s2, s2)
    } else if (this.type === 'ingot') {
      this.svg(INGOT_FILL, 'transparent', this.color, 0, s2, s2)
      this.svg(INGOT_STROKE, '#000', 'transparent', 0, s2, s2)
    } else if (this.type === 'axe') {
      const s2 = -(this.size / 2)
      this.svg(AXE_PATH, '#000', this.color, 1, s2, s2)
    }
    this.context.rotate(this._frame / 5)
    this.context.translate(-s, -s)
    this.drawDebug()
    this.drawShadow()
  }
}

const AXE_PATH =
  'M11 21L22 34L29 27V51L33 56L36 51V27L42 34L53 21L42 9L36 16L33 13L29 16L22 9L11 21Z'

const INGOT_STROKE =
  'M15 33L11 48H35M15 33H30M15 33L35 17H48M30 33L35 48M30 33L48 17M35 48L53 31L48 17'

const INGOT_FILL = 'M11 48L15 33L35 17H48L53 31L35 48H11Z'
const GEM_FILL = 'M32 8L53 20L53 44L32 56L11 44V20L20 25L11 20L32 8Z'
const GEM_STROKE =
  'M11 20L32 8M11 20V44M11 20L20 25M32 8L53 20M32 8V18M53 20V44M53 20L44 25M53 44L32 56M53 44L44 39M32 56L11 44M32 56V46M11 44L20 39M20 25V39M20 25L32 18M20 39L32 46M32 46L44 39M44 39V25M44 25L32 18'
