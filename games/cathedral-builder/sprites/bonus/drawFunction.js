game.sprites.bonus.drawFunction = function (ctx) {

    // Colors
    let light = '#B0A29B'
    let medium1 = '#9D8B82'
    let medium2 = '#856F63'
    let medium3 = '#674B3C'
    let dark = '#411F0C'
    // Draw
    ctx.fillStyle=light
    ctx.fill(this.upLeft)
    ctx.fillStyle=medium1
    ctx.fill(this.center)
    ctx.fillStyle=medium2
    ctx.fill(this.left)
    ctx.fill(this.down)
    ctx.fill(this.up)
    ctx.fillStyle=medium3
    ctx.fill(this.downLeft)
    ctx.fill(this.upRight)
    ctx.fill(this.downRight)
    ctx.fillStyle=dark
    ctx.fill(this.right)
    ctx.fillStyle=dark
    ctx.font = "12px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.text,50,28)
}