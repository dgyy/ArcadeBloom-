class Crosshair {
  constructor({ position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 } }) {
    this.position = position
    this.velocity = velocity
  }

  draw() {
    const x = this.position.x
    const y = this.position.y
    // top left
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x + 7, y)
    c.lineTo(x + 7, y - 7)
    c.strokeStyle = 'yellow'
    c.stroke()

    // top right
    c.beginPath()
    c.moveTo(x + 14, y - 7)
    c.lineTo(x + 14, y)
    c.lineTo(x + 21, y)
    c.strokeStyle = 'yellow'
    c.stroke()

    // bottom left
    c.beginPath()
    c.moveTo(x, y + 7)
    c.lineTo(x + 7, y + 7)
    c.lineTo(x + 7, y + 14)
    c.strokeStyle = 'yellow'
    c.stroke()

    // bottom right
    c.beginPath()
    c.moveTo(x + 14, y + 14)
    c.lineTo(x + 14, y + 7)
    c.lineTo(x + 21, y + 7)
    c.strokeStyle = 'yellow'
    c.stroke()
  }

  update() {
    this.draw()
  }
}
