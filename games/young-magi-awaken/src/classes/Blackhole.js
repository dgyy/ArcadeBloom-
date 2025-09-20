import { GROUND_HEIGHT, GROUND_FRICTION } from '../globals.js'
import { circleRectCollisionResponse, circleRectCollision } from '../utils.js'
export class Blackhole {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    radius = 5,
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.newRadius = radius

    this.pointer = {
      x: this.position.x,
      y: this.position.y,
      radius: 5,
      angle: 0,
    }

    this.timePassed = 0
    this.isShrinking = false
    this.isGrowing = true
  }

  draw(c) {
    // larger purple blur
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.shadowColor = '#490385'
    c.shadowBlur = 50 + Math.abs(Math.sin(this.timePassed)) * 10
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    // end larger purple blur

    // small purple blur
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.shadowColor = 'purple'
    c.shadowBlur = 15 + Math.abs(Math.sin(this.timePassed)) * 10
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    c.fillStyle = 'rgba(0,0,0,1)'
    c.fill()
    // end purple blur

    c.shadowBlur = 0

    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.shadowColor = 'black'
    c.shadowBlur = 20
    c.fillStyle = 'black'
    c.fill()
    c.shadowBlur = 0
  }

  update({
    delta,
    c,
    canvas,
    scroll,
    mouse,
    boxes,
    letters,
    font,
    gameInitialized,
    spritesToMagnetize,
    shrinkers,
  }) {
    this.draw(c)
    this.timePassed += 1.2 * delta
    if (this.enableGravity) this.velocity.y += GRAVITY
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta

    this.handleFloorCollision(canvas)
    this.handleCeilingCollision()
    this.handleLeftBoundaryCollision(scroll)
    this.handleRightBoundaryCollision(canvas, scroll)
    this.handleBoxCollisions(boxes)
    this.handleShrinkerCollisions(shrinkers)
    this.runGrow(c)
    this.shrinkToBaseSize()
    this.drawPointer({ c, mouse })
    this.magnetize(letters, font)
    this.magnetize(spritesToMagnetize)
  }

  shrinkToBaseSize() {
    const RADIUS_SHRINK_RATE = 0.1
    const BASE_RADIUS = 20
    if (this.isShrinking && this.radius > BASE_RADIUS) {
      this.radius -= RADIUS_SHRINK_RATE
    } else if (this.radius <= BASE_RADIUS) {
      this.isShrinking = false
    }
  }

  handleShrinkerCollisions(shrinkers) {
    for (let shrinker of shrinkers) {
      if (circleRectCollision(this, shrinker)) {
        this.isShrinking = true
      }
    }
  }

  handleBoxCollisions(boxes) {
    for (let box of boxes) {
      if (this.radius > box.width / 2 && box.shouldMagnetize) continue

      const collisionSide = circleRectCollisionResponse(this, box)
      if (collisionSide) {
        if (collisionSide === 'left' || collisionSide === 'right') {
          // If collision is horizontal, zero out the x velocity
          this.velocity.x *= -0.2 // You can adjust this for a bouncing effect
          this.velocity.y *= GROUND_FRICTION // Sliding friction
        } else if (collisionSide === 'top' || collisionSide === 'bottom') {
          // If collision is vertical, zero out the y velocity
          this.velocity.y *= -0.2 // Adjust for bounce
          this.velocity.x *= GROUND_FRICTION // Sliding friction
        }
        break // Exit early once a collision is detected
      }
    }
  }

  handleFloorCollision(canvas) {
    if (this.position.y + this.radius >= canvas.height - GROUND_HEIGHT) {
      this.velocity.y = 0
      this.velocity.x *= GROUND_FRICTION
      this.position.y = canvas.height - this.radius - GROUND_HEIGHT
    }
  }

  handleCeilingCollision() {
    if (this.position.y - this.radius <= 0) {
      this.velocity.y = 0
      this.position.y = this.radius
      this.velocity.x *= GROUND_FRICTION
    }
  }

  handleLeftBoundaryCollision(scroll) {
    if (this.position.x - this.radius - scroll <= 0) {
      this.position.x = this.radius + scroll
      this.velocity.x = 0
      this.velocity.y *= GROUND_FRICTION
    }
  }

  handleRightBoundaryCollision(canvas, scroll) {
    if (this.position.x + this.radius >= canvas.width + scroll) {
      this.position.x = canvas.width - this.radius + scroll
      this.velocity.x = 0
      this.velocity.y *= GROUND_FRICTION
    }
  }

  drawPointer({ c, mouse }) {
    if (!mouse.down) return

    // Assuming `this.position` represents the current position of the black hole.
    this.pointer.x = this.position.x
    this.pointer.y = this.position.y

    const tipX =
      this.pointer.x + -Math.cos(this.pointer.angle) * (this.radius + 14) // Increase the length for a longer arrow
    const tipY =
      this.pointer.y + -Math.sin(this.pointer.angle) * (this.radius + 14)

    // Arrowhead
    const size = 10 // Adjust for a larger or smaller arrowhead
    const angle = Math.atan2(tipY - this.pointer.y, tipX - this.pointer.x)
    const angle1 = angle + Math.PI / 6 // Adjust for a wider or narrower arrowhead
    const angle2 = angle - Math.PI / 6

    const x1 = tipX - size * Math.cos(angle1)
    const y1 = tipY - size * Math.sin(angle1)
    const x2 = tipX - size * Math.cos(angle2)
    const y2 = tipY - size * Math.sin(angle2)

    c.beginPath()
    c.moveTo(tipX, tipY)
    c.lineTo(x1, y1)
    c.lineTo(x2, y2)
    c.lineTo(tipX, tipY)
    c.fillStyle = '#993399'
    c.fill()
    c.closePath()
  }

  grow(radius = 1) {
    this.isGrowing = true
    this.newRadius = this.radius + radius
  }

  runGrow(c) {
    const RADIUS_GROWTH_RATE = 0.1
    if (this.isGrowing && this.radius < this.newRadius) {
      this.radius += RADIUS_GROWTH_RATE
    } else if (this.radius >= this.newRadius) {
      this.isGrowing = false
    }
  }

  // Updated magnetize function
  magnetize(objects, font) {
    if (this.radius < 20) return
    const MIN_DISTANCE = this.radius * 1.5
    const SUCKED_IN_THRESHOLD = 5

    let checkpointLetterSuckedIn = false

    // First loop: Handle magnetization
    for (let object of objects) {
      if (!object.shouldMagnetize) continue

      const directionX =
        this.position.x - (object.position.x + object.width / 2)
      const directionY =
        this.position.y - (object.position.y + object.height / 2)
      const distance = Math.sqrt(
        directionX * directionX + directionY * directionY,
      )
      const dx = Math.min(this.radius / 10, 100 / distance)

      if (
        this.radius > Math.min(object.width / 2, object.height / 2) &&
        distance < MIN_DISTANCE
      ) {
        object.underBlackHoleInfluence = true
        setTimeout(() => {
          object.underBlackHoleInfluence = false
        }, 500)
        object.position.x += (dx * directionX) / distance
        object.position.y += (dx * directionY) / distance

        if (distance < this.radius) {
          object.width *= 0.9 // Adjust this rate as needed.
          object.height *= 0.9
        }
      }
    }

    // Second loop: Check if all objects have been sucked in
    let allSuckedIn = true
    for (let object of objects) {
      if (
        object.width > SUCKED_IN_THRESHOLD ||
        object.height > SUCKED_IN_THRESHOLD
      ) {
        allSuckedIn = false
        break // If one object isn't sucked in, we can exit the loop early
      }
      if (
        object.isCheckpoint &&
        object.width <= SUCKED_IN_THRESHOLD &&
        object.height <= SUCKED_IN_THRESHOLD
      ) {
        checkpointLetterSuckedIn = true
      }
    }

    if (allSuckedIn && font && !checkpointLetterSuckedIn) {
      font.nextSequence()
    }
  }
}
