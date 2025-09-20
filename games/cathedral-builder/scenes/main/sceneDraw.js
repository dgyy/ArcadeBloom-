//////////////////////
// Draw scene
//////////////////////
game.scenes.main.draw = function() {
    /////////// TO REMOVE ////////////
    //let ctx = mge._canvas._renderContext
    //ctx.strokeStyle = 'black'
    //ctx.strokeRect(0,0,mge.game.width, mge.game.height)
    // FPS
    //ctx.fillText(Math.floor(mge.game.fps),1250,20)
    //ctx.fillText(game.sprites.cathedral.totalStonesToBuild,1250,30)
    //////////////////////////////////
    game.sprites.cathedral.draw()
    game.sprites.click.cloneExecuteForEach('draw')
    game.sprites.booster.cloneExecuteForEach('draw')
    game.sprites.stock.cloneExecuteForEach('draw')
    game.sprites.bonus.cloneExecuteForEach('draw')
    game.sprites.particle.cloneExecuteForEach('draw')
    game.sprites.date.draw()
    game.sprites.build.draw()
    game.sprites.level.draw()
    game.sprites.tuto.draw()
    game.sprites.gameOver.draw()
}
