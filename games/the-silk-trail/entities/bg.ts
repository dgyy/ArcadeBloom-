import { GROUND_Y, LEVELS } from '../constants'
import { Sprite } from './sprite'

export const Background = ({ canvas, getSpeed }) => {
  const sky = new Rect(0, 0, canvas.width, canvas.height - 223, [
    '#0081AA',
    '#6AC4E0',
  ])

  const mountain = new Mountain(0, GROUND_Y - 129, canvas.width, 155)

  const groundLine = new Rect(
    0,
    GROUND_Y - 130,
    canvas.width,
    canvas.height - GROUND_Y + 130,
    ['#B78F73', '#8C6548'],
  )
  return {
    render() {
      sky.render()
      groundLine.render()
      mountain.render()
    },
    update() {
      mountain.update()
      mountain.dx = getSpeed() * -1
      if (mountain.x < -400) {
        mountain.x = canvas.width
        mountain.scaleX = Math.random() * 1.5 + 1
        mountain.scaleY = Math.random() * 0.6 + 0.4
        mountain.y = GROUND_Y - 129 + 180 * (1 - mountain.scaleY)
      }
    },
    shutdown() {},
  }
}

export class Rect extends Sprite {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
    paths?: string[],
  ) {
    super({ x, y, width, height, anchor: { x: 0, y: 0 } })
    this.colors = colors
    this.paths = paths
  }

  draw() {
    if (this.opacity === 0) return

    const gradient = this.context.createLinearGradient(
      0,
      0,
      0,
      this.height * 1.2,
    )
    this.colors.forEach((c, i) =>
      gradient.addColorStop(i / this.colors.length, c),
    )
    this.context.fillStyle = gradient
    this.context.beginPath()
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.scale(4, 4)
    if (this.paths) {
      this.context.scale(0.35, 0.35)
      this.paths.forEach((p) => this.context.fill(new Path2D(p)))

      this.context.scale(1, 1)
    } else {
      this.context.fill()
    }
    this.context.scale(1, 1)
  }
}

export class Mountain extends Sprite {
  constructor(x: number, y: number, width: number, height: number) {
    super({ x, y, width, height, anchor: { x: 0, y: 1 } })
  }

  draw() {
    if (this.opacity === 0) return

    this.context.scale(this.scaleX, this.scaleY)
    this.svg('M106 1L1 154H209L106 1Z', 'transparent', '#B78F73', 1)
  }
}

export class Path extends Sprite {
  constructor() {
    super()
  }

  draw() {
    if (this.opacity === 0) return
    this.context.lineWidth = 10
    LEVELS.forEach((l, i, a) => {
      this.context.beginPath()
      this.context.strokeStyle =
        this.levelIndex === i ? '#f00' : this.levelIndex > i ? '#000' : '#0003'
      this.context.moveTo(l.x, l.y - 40)
      this.context.lineTo(a[i + 1]?.x, a[i + 1]?.y - 40)
      this.context.closePath()
      this.context.stroke()
    })
  }
}

export class Circle extends Sprite {
  draw() {
    if (this.opacity === 0) return

    this.context.beginPath()
    this.context.arc(0, 0, this.size / 2, 0, Math.PI * 2)
    this.context.fillStyle = this.color
    this.context.closePath()
    this.context.fill()
  }
}
