import {
  SOLDIER_WIDTH,
  SOLDIER_HEIGHT,
  GRAVITY,
  GROUND_HEIGHT,
  SHRINK_DISTANCE,
} from '../globals.js'
import { boxCollision } from '../utils.js'
const BASE_VELOCITY = 20

export class Soldier {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    mass = 10,
    direction = 'left',
    scale = 2.5,
    imageSrc,
    travelDistance,
  }) {
    this.position = position
    this.startingPosition = { ...position }
    this.velocity = velocity
    this.width = 20 * scale
    this.height = SOLDIER_HEIGHT * scale
    this.msPassed = 0
    this.ATTACK_RATE = 2000
    this.shrink = false

    this.imageLoaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.imageLoaded = true
    }
    this.image.src = imageSrc
    this.cropbox = {
      x: 20,
      y: 19,
      width: 20,
      height: 24,
      offset: {
        x: 0,
        y: 10,
      },
    }
    this.frames = 0
    this.maxFrames = 8
    this.frameDelay = 12
    this.currentFrame = 0
    this.scale = scale
    this.state = 'walk'
    this.totalScale = 1
    this.mass = mass
    this.direction = direction
    this.attackFinished = false
    this.travelDistance = travelDistance
    this.shouldMagnetize = true
    this.type = 'soldier'
    this.scaledDownWidth = this.width / this.scale
    this.scaledDownHeight = this.height / this.scale
  }

  draw(c) {
    // Calculate the offsets based on the cropbox dimensions and scale.
    const offsetX = (this.cropbox.width * this.scale) / 2
    const offsetY = (this.cropbox.height * this.scale) / 2

    // Save the current drawing state.
    c.save()

    // Translate the context to the player's position plus the offsets.
    // This means we are setting the drawing origin to the center of the player's sprite.
    c.translate(this.position.x + offsetX, this.position.y + offsetY)

    if (this.shrink) {
      // Reduce the total scale by 10%.
      this.totalScale -= 0.1
      c.scale(this.totalScale, this.totalScale)
    }

    if (this.direction === 'left') {
      // Flip the drawing on the x-axis (horizontal flip).
      c.scale(-1, 1)
    }

    // Draw the player's image.
    c.drawImage(
      this.image,
      this.cropbox.x * this.currentFrame,
      this.cropbox.y,
      this.width / this.scale,
      this.height / this.scale,
      -offsetX + (this.cropbox.offset ? this.cropbox.offset.x : 0),
      -offsetY + (this.cropbox.offset ? this.cropbox.offset.y : 0), // Add safety check in case offset is not defined.
      this.width,
      this.height,
    )

    // this.renderDebugBoxes(c)

    c.restore()

    // Call the debug method.
  }

  renderDebugBoxes(c) {
    // player's center relative to scale
    const offsetX = (this.cropbox.width * this.scale) / 2
    const offsetY = (this.cropbox.height * this.scale) / 2

    // red box
    c.fillStyle = 'rgba(255,0,0,0.2)'
    c.fillRect(-offsetX, -offsetY, this.width, this.height)

    // blue box / cropbox
    c.fillStyle = 'rgba(0,0,255,0.2)'
    c.fillRect(
      -offsetX,
      -offsetY,
      this.cropbox.width * this.scale,
      this.cropbox.height * this.scale,
    )
  }

  update({ c, player, delta, blackHole, canvas, boxes }) {
    this.draw(c)
    this.animateSprite(c)
    this.checkForVerticalCollisions({ boxes })
    this.applyGravity({ delta, canvas, blackHole })
    this.checkIfShouldDamagePlayer({ player, c })

    // turn around in either direction
    if (
      Math.abs(this.position.x - this.startingPosition.x) >=
        this.travelDistance &&
      this.state === 'walk'
    ) {
      // Flip the direction
      this.direction = this.direction === 'right' ? 'left' : 'right'
      // Reset the starting position for the next 100 pixels
      this.startingPosition.x = this.position.x
      this.velocity.x = -this.velocity.x
    }

    // determine which state to use
    const isTouchingPlayer = this.shouldAttackPlayer({ delta, player, c })
    if (isTouchingPlayer && this.state === 'walk') {
      this.setAttackState()
    } else if (
      !isTouchingPlayer &&
      this.state === 'attack' &&
      this.attackFinished
    ) {
      this.currentFrame = 0
      this.setWalkState()
      this.attackFinished = false // Reset for the next attack
    } else {
      this.position.x += this.velocity.x * delta
    }
  }

  shouldAttackPlayer({ delta, player, c }) {
    let soldierBoundingBox = {
      position: {
        x:
          this.position.x +
          (this.direction === 'left' ? -5 * this.scale : 5 * this.scale + 20),
        y: this.position.y,
      },
      width: this.width - 20,
      height: this.height,
    }

    // c.fillStyle = 'rgba(0,255,0,0.8)'
    // c.fillRect(
    //   soldierBoundingBox.position.x,
    //   soldierBoundingBox.position.y,
    //   soldierBoundingBox.width,
    //   soldierBoundingBox.height,
    // )

    const isTouchingPlayer = boxCollision({
      box1: soldierBoundingBox,
      box2: player,
    })

    return isTouchingPlayer
  }

  applyGravity({ delta, canvas, blackHole }) {
    // Check if under black hole's influence
    const distanceToBlackHole = Math.sqrt(
      Math.pow(this.position.x + this.width / 2 - blackHole.position.x, 2) +
        Math.pow(this.position.y + this.height / 2 - blackHole.position.y, 2),
    )

    const underBlackHoleInfluence = distanceToBlackHole < blackHole.radius * 1.5 // You'll need to define this constant or determine it dynamically

    if (underBlackHoleInfluence) return

    this.position.y += this.velocity.y * delta
    this.velocity.y += GRAVITY

    // if touching ground
    if (this.position.y + this.height >= canvas.height - GROUND_HEIGHT) {
      this.position.y = canvas.height - GROUND_HEIGHT - this.height
      this.velocity.y = 0
    }
  }

  animateSprite() {
    this.frames++

    if (this.frames % this.frameDelay === 0) {
      this.currentFrame++
    }

    this.checkIfAttackIsPermitted()

    if (this.state === 'attack' && this.currentFrame === this.maxFrames - 1) {
      this.attackFinished = true
    }

    if (this.currentFrame >= this.maxFrames) {
      this.frames = 0
      this.currentFrame = 0
    }
  }

  checkIfAttackIsPermitted() {
    this.attackPermitted = false

    if (
      this.state === 'attack' &&
      this.currentFrame > 1 &&
      this.currentFrame < 3 &&
      this.attackPermitted !== true
    ) {
      this.attackPermitted = true
    }
  }

  checkIfShouldDamagePlayer({ player, c }) {
    const offsetX =
      this.direction === 'right' ? 19 * this.scale : -19 * this.scale

    const attackbox = {
      position: {
        x: this.position.x + offsetX,
        y: this.position.y,
      },
      width: this.width,
      height: this.height,
    }

    // c.fillStyle = 'rgba(0,255,0,0.8)'
    // c.fillRect(
    //   attackbox.position.x,
    //   attackbox.position.y,
    //   attackbox.width,
    //   attackbox.height,
    // )

    if (
      boxCollision({ box1: attackbox, box2: player }) &&
      this.attackPermitted &&
      !player.invincible
    ) {
      // c.fillStyle = 'rgba(0,255,0,0.8)'
      // c.fillRect(
      //   attackbox.position.x,
      //   attackbox.position.y,
      //   attackbox.width,
      //   attackbox.height,
      // )

      player.loseHeart()
    }
  }

  setAttackState() {
    this.state = 'attack'
    this.width = 38 * this.scale
    this.cropbox = {
      x: 38,
      y: 44,
      width: 38,
      height: SOLDIER_HEIGHT,
      offset: {
        x: this.direction === 'left' ? 19 * this.scale : 0, // You might need to adjust this
        y: -5,
      },
    }

    this.frames = 0
    this.maxFrames = 5
    this.frameDelay = 12
    this.currentFrame = 0
    this.velocity.x = 0
    this.scaledDownWidth = this.width / this.scale
    this.scaledDownHeight = this.height / this.scale
  }

  checkForVerticalCollisions({ boxes }) {
    let hasCollision = false
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]

      if (boxCollision({ box1: this, box2: box })) {
        if (
          this.velocity.y > 0 &&
          this.position.y + this.height >= box.position.y
        ) {
          // Moving downwards
          this.position.y = box.position.y - this.height
          this.velocity.y = 0
          hasCollision = true
          break
        } else if (
          this.velocity.y < 0 &&
          this.position.y <= box.position.y + box.height
        ) {
          // Moving upwards
          this.position.y = box.position.y + box.height
          this.velocity.y = 0
          hasCollision = true
          break
        }
      }
    }
    return hasCollision
  }

  setWalkState() {
    if (this.currentFrame !== 0) return
    this.width = 20 * this.scale
    this.state = 'walk'
    this.cropbox = {
      x: 20,
      y: 19,
      width: 20,
      height: 24,
      offset: {
        x: 0,
        y: 10,
      },
    }
    this.frames = 0
    this.maxFrames = 8
    this.frameDelay = 12
    this.currentFrame = 0
    this.velocity.x =
      this.direction === 'left' ? BASE_VELOCITY * -1 : BASE_VELOCITY

    this.scaledDownWidth = this.width / this.scale
    this.scaledDownHeight = this.height / this.scale
  }
}
