game.sprites.booster.drawFunction = function (ctx) {

    // Shortcuts
    let dark = game.colors.dark
    let transparentGrey = game.colors.transparentGrey

    // Draw button
    ctx.fillStyle=dark
    ctx.strokeStyle=dark
    ctx.lineWidth=2
    ctx.strokeRect(0,0,this.width,this.height)
    // Draw Title
    ctx.font = "18px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.text, this.width/2, this.height/2 -3)
    // Draw cost
    ctx.font = "14px serif"
    ctx.fillText(this.goldNeeded + ' gold', this.width/2, this.height/2 + 15)
    // Hide if not enough gold
    ctx.fillStyle = transparentGrey
    if (this.disable) {
        ctx.fillRect(0,0,this.width,this.height)
    } 
}


