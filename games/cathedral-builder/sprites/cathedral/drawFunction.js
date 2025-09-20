game.sprites.cathedral.drawFunction = function (ctx) {
    // Shortcuts
    let v = game.variables

    // Draw content of cathedral canvas
    if(v.stoneBuilt>=16000) {
        ctx.drawImage(this.canvas0.htmlRef, 0, 0)
    } else if(v.stoneBuilt>=5500) {
        ctx.drawImage(this.canvas50.htmlRef, 0, 0)
    } else if(v.stoneBuilt>=800) {
        ctx.drawImage(this.canvas90.htmlRef, 0, 0)
    } else {
        ctx.drawImage(this.canvas110.htmlRef, 0, 0)
    }
}
