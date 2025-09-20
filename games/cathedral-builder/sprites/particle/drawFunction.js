game.sprites.particle.drawFunction = function (ctx) {
    // Shortcuts
    let r = this.r
    let g = this.g
    let b = this.b
    let a = this.a

    // Draw button
    let rgba = 'rgba('.concat(r,',',g,',',b,',',a,')')
    ctx.fillStyle=rgba
    ctx.fillRect(0,0,this.width,this.height)
}
