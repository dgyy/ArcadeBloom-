game.sprites.tuto.drawFunction = function (ctx) {
    // Shortcuts
    let v = game.variables
    let dark = game.colors.dark


    // Sytle
    ctx.fillStyle=dark
    ctx.strokeStyle=dark
    ctx.lineWidth=4
    ctx.font = "25px serif"

    if (v.unlockPhase == 0) {
        ctx.textAlign = "center"
        ctx.fillText('13th CENTURY', this.width/2, this.height/2)
        ctx.fillText('GOLDEN AGE OF CATHEDRALS', this.width/2, this.height/2+50)
        ctx.font = "16px serif"
        ctx.fillText('Click to continue', this.width/2, this.height/2+100)
    }

    if (v.unlockPhase == 0.1) {
        ctx.textAlign = "center"
        ctx.fillText('WILL YOU BE ABLE TO BUILD A CATHEDRAL', this.width/2, this.height/2)
        ctx.fillText('IN LESS THAN 100 YEARS?', this.width/2, this.height/2+50)
        ctx.font = "16px serif"
        ctx.fillText('Click to continue', this.width/2, this.height/2+100)
    }

    if (v.unlockPhase == 1) {
        ctx.textAlign = "left"
        ctx.fillText('FIRST DIG UP ROCK', -130, this.height/2 -15)
    }

    if (v.unlockPhase == 2) {
        ctx.textAlign = "left"
        ctx.fillText('THEN CUT STONES', -130, this.height/2 + 105)
    }

    if (v.unlockPhase == 3) {
        ctx.textAlign = "left"
        ctx.fillText('GREAT !!! YOU CAN NOW START BUILDNG', -130, this.height/2 -135)
    }

    if (v.unlockPhase == 5) {
        ctx.textAlign = "center"
        ctx.fillText('PERFECT! WE CAN NOW START THE GAME', this.width/2, this.height/2)
        ctx.fillText('REMEMBER YOU HAVE 100 YEARS', this.width/2, this.height/2+50)
        ctx.fillText('TO BUILD YOUR CATHEDRAL', this.width/2, this.height/2+100)
    }

}