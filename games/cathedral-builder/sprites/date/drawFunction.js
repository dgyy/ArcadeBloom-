game.sprites.date.drawFunction = function (ctx) {

    let dark = game.colors.dark
    let v = game.variables

    // Draw button
    ctx.fillStyle=dark
    ctx.font = "30px serif"
    ctx.fillText('Year: ' + v.year + ' - Month: ' + v.month, 10, this.height/2 + 5)
}
