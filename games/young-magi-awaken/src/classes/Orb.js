export class Orb {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    radius = 5,
  }) {
    this.position = position
    this.center = JSON.parse(JSON.stringify(position))
    this.velocity = velocity
    this.radius = radius
    this.timePassed = 0
    this.shadowBlur = 10
    this.state = 'idle'
  }

  draw(c) {
    c.save()

    c.shadowBlur = this.shadowBlur
    c.shadowColor = 'purple'
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius + 3,
      0,
      Math.PI * 2,
      false,
    )
    c.fillStyle = 'purple'
    c.fill()

    c.shadowBlur = 2
    c.shadowColor = 'black'
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = 'black'
    c.fill()
    c.restore()
  }

  update({ delta, c, blackHole }) {
    this.draw(c)
    this.magnetize(blackHole)
    this.timePassed += 2 * delta
    this.shadowBlur = 10 * Math.abs(Math.sin(this.timePassed)) + 3
    this.position.x = this.center.x + Math.sin(this.timePassed) * 2
    this.position.y = this.center.y + Math.cos(this.timePassed) * 2
    if (this.state === 'shrink') this.radius -= 0.5
  }

  shrink() {
    this.state = 'shrink'
  }

  magnetize(blackHole) {
    // magnetize to black hole
    const MIN_DISTANCE = blackHole.radius * 2.5 // set the minimum distance for attraction
    const PULL_STRENGTH = blackHole.radius * 1.4 // pull based on size of black hole
    const directionX = blackHole.position.x - this.position.x
    const directionY = blackHole.position.y - this.position.y
    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY,
    )
    const dx = Math.min(10, PULL_STRENGTH / distance) // adjust strength based on distance

    if (distance < MIN_DISTANCE) {
      this.center.x += (dx * directionX) / distance
      this.center.y += (dx * directionY) / distance
    }
  }
}
