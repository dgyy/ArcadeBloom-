game.sprites.logo.drawFunction = function (ctx) {
    // Shortcuts
    let v = game.variables
    let dark = game.colors.dark
    let light = game.colors.light
 
    // Background
    ctx.fillStyle=light
    ctx.strokeStyle=dark
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(200, 200, 200, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Logo
    ctx.strokeStyle=dark
    ctx.fillStyle='#a500e1'
    ctx.lineWidth = 6
    ctx.stroke(this.umbrellaDown)
    ctx.lineWidth = 9
    ctx.fill(this.umbrellaUp)
    ctx.stroke(this.umbrellaUp)
    ctx.stroke(this.D)
    ctx.stroke(this.l1)
    ctx.stroke(this.p)
    ctx.stroke(this.u)
    ctx.stroke(this.iDown)
    ctx.strokeStyle='#a500e1'
    ctx.stroke(this.iUp)
    ctx.stroke(this.l2)
    ctx.stroke(this.e)
}
