game.sprites.gameOver.drawFunction = function (ctx) {
    // Shortcuts
    let v = game.variables
    let light = game.colors.light
    let dark = game.colors.dark

    // Draw button
    ctx.fillStyle=dark
    ctx.strokeStyle=dark
    ctx.lineWidth=4
    ctx.fillRect(0,0,this.width,this.height)
    ctx.strokeRect(0,0,this.width,this.height)
    // Draw GAME OVER
    ctx.fillStyle=light
    ctx.font = "40px serif"
    ctx.textAlign = "center"
    if (v.year>=1300) {
        ctx.fillText('GAME OVER', this.width/2, this.height/2 -70)
        ctx.font = "25px serif"
        ctx.fillText('You were not able to build the cathedral', this.width/2, this.height/2 - 5)
        ctx.fillText('in less than 100 years!', this.width/2, this.height/2 + 35)
    } else {
        ctx.fillText('CONGRATULATIONS!', this.width/2, this.height/2 -70)
        ctx.font = "25px serif"
        ctx.fillText('You were able to build the catheral', this.width/2, this.height/2 - 5)
        ctx.fillText('in less than 100 years!', this.width/2, this.height/2 + 35)
    }
    ctx.fillText('TRY AGAIN', this.width/2, this.height/2 + 105)
    ctx.strokeStyle=light
    ctx.strokeRect(135,220,220,50)
}
