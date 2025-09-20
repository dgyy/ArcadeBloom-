export class Particle {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    fadeSpeed,
    radius = 3,
    delay = 0,
    color = 'red',
  }) {
    this.position = position
    this.basePosition = JSON.parse(JSON.stringify(position))
    this.velocity = velocity
    this.alpha = 1
    this.fadeSpeed = fadeSpeed
    this.radius = radius
    this.delay = delay
    this.passedTime = 0
    this.dissonance = {
      x: 5,
      y: 5,
    }
    this.color = color
  }

  draw(c) {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update({ delta, c, scroll }) {
    this.passedTime += delta
    if (scroll) {
      this.position.x = this.basePosition.x + scroll * 0.98
    }
    if (this.passedTime < this.delay) return

    this.draw(c)

    if (this.fadeSpeed) {
      this.wispAway(delta)
    }
  }
  wispAway(delta) {
    this.position.x +=
      this.velocity.x * delta + (Math.random() - 0.5) * this.dissonance.x
    this.position.y +=
      this.velocity.y * delta + (Math.random() - 0.5) * this.dissonance.y

    this.alpha -= this.fadeSpeed * delta
  }
}
