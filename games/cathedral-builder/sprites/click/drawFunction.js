game.sprites.click.drawFunction = function (ctx) {
    // Shortcuts
    let id = this.id
    let dark = game.colors.dark
    let transparentGrey = game.colors.transparentGrey

    // Draw button
    ctx.fillStyle=dark
    ctx.strokeStyle=dark
    ctx.lineWidth=4
    ctx.font = "30px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.text, this.width/2, this.height/2 + 10)
    ctx.strokeRect(0,0,this.width,this.height)

    // Progression bar
    if (this.isStarted) {
        ctx.fillStyle = dark
        ctx.fillRect(0,this.height*3/4,this.width*this.progress,this.height/4)
    }

    // Hide if prerequisites are KO
    ctx.fillStyle = transparentGrey
    if (id == 'stoneButton' && game.variables.rockStock < 1) {
        ctx.fillRect(0,0,this.width,this.height)
    } 
}
