export class Heart {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    imageSrc,
  }) {
    this.position = position
    this.velocity = velocity

    this.imageLoaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.imageLoaded = true
    }
    this.image.src = imageSrc

    // lost heart x is at 77px, current heart is at 95px
    this.cropbox = {
      x: 86,
      y: 0,
      width: 16,
      height: 13,
    }
    this.currentFrame = 0
    this.scale = 2
    this.state = 'full'
  }

  draw(c, scroll) {
    c.drawImage(
      this.image,
      this.cropbox.x,
      this.cropbox.y,
      this.cropbox.width,
      this.cropbox.height,
      this.position.x + scroll,
      this.position.y,
      this.cropbox.width * this.scale,
      this.cropbox.height * this.scale,
    )
  }

  update({ c, scroll }) {
    this.draw(c, scroll)
  }

  loseHeart() {
    this.state = 'empty'
    this.cropbox.x = 70
  }
}
