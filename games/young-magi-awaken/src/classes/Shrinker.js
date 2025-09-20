export class Shrinker {
  constructor({ position = { x: 0, y: 0 }, color = 'red', width, height }) {
    this.position = position
    this.color = color
    this.width = width
    this.height = height
    this.elapsed = 0
  }

  draw(c) {
    c.save()
    c.globalAlpha = 0.175 * Math.sin(this.elapsed) + 0.275
    c.shadowColor = 'yellow'
    c.shadowBlur = 20
    c.fillStyle = 'yellow'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.globalAlpha = 1
    c.restore()
  }

  update({ delta, c, scroll }) {
    this.draw(c)
    this.elapsed += delta
  }
}
