export class Letter {
  constructor({
    char,
    x,
    y,
    image,
    sourceX,
    sourceY,
    width,
    height,
    delay,
    isCheckpoint,
    shouldMagnetize = true,
  }) {
    this.char = char
    this.position = {
      x,
      y,
    }
    this.image = image
    this.sourceX = sourceX
    this.sourceY = sourceY
    this.width = width
    this.height = height

    this.opacity = 0 // Start with an opacity of 0 to make it invisible initially
    this.offsetY = 20 // Start slightly below its final y-position
    this.delay = delay || 0
    this.framesElapsed = 0 // Add a property to keep track of frames elapsed since the creation of the letter
    this.shouldMagnetize = shouldMagnetize
    this.isCheckpoint = isCheckpoint
  }

  draw(c) {
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.position.x,
      this.position.y - this.offsetY,
      this.width,
      this.height,
    )
    c.globalAlpha = 1 // Reset globalAlpha to its default value
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  animate() {
    if (this.framesElapsed < this.delay) {
      this.framesElapsed++
      return // If the delay hasn't elapsed, we don't animate the letter
    }

    this.opacity = Math.min(this.opacity + 0.05, 1)
    this.offsetY = Math.max(this.offsetY - 1, 0)
  }
}
