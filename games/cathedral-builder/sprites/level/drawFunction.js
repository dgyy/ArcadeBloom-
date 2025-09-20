game.sprites.level.drawFunction = function (ctx) {
    // Shortcuts
    let v = game.variables
    let dark = game.colors.dark
 
    // Draw Level text
    ctx.fillStyle=dark
    ctx.font = "30px serif"
    ctx.textAlign = "left"
    ctx.fillText('Level ' + v.level, 0, this.height/2 + 5)

    // Draw progress frame
    let barSize = 300
    ctx.strokeStyle=dark
    ctx.strokeRect(110,15,barSize,15)
    // Draw progress
    let progress = v.stoneBuilt / v.levelGoal
    ctx.fillRect(110,15,progress*barSize,15)

    // Draw current score
    ctx.font = "20px serif"
    ctx.fillText(v.stoneBuilt, 110 + progress*barSize, 50)
    
    // Draw target score
    ctx.font = "20px serif"
    ctx.fillText(v.levelGoal, 120 + barSize, 28)
}
