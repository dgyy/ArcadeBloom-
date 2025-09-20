game.sprites.build.drawFunction = function (ctx) {
    // Shortcuts
    let dark = game.colors.dark
    let transparentGrey = game.colors.transparentGrey
    let v = game.variables

    // Draw button
    ctx.fillStyle=dark
    ctx.strokeStyle=dark
    ctx.lineWidth=4
    ctx.font = "30px serif"
    ctx.textAlign = "center"
    ctx.strokeRect(0,0,this.width,this.height)

    // Dispaly if there are enough stones and not in auto click mode
    if (v.stoneStock >= 1) {
        ctx.fillText('BUILD', this.width/2, this.height/2 - 7)
        ctx.fillText('CATHEDRAL', this.width/2, this.height/2 + 27)
        if (performance.now() < v.buildAutoClickUntil) {
            ctx.fillStyle = transparentGrey
            ctx.fillRect(0,0,this.width,this.height)
       }
    } else {
        ctx.font = "25px serif"
        ctx.fillText("Need stones", this.width/2, this.height/2 - 10)
        ctx.fillText("to build the cathedral", this.width/2, this.height/2 + 25)
        ctx.fillStyle = transparentGrey
        ctx.fillRect(0,0,this.width,this.height)
    }
}

