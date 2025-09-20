//////////////////////
// Update scene
//////////////////////
game.scenes.main.update = function() {
    // Shortcut
    let s = game.sprites
    let v = game.variables

    // Check if game over
    if (v.year>=1300 || v.stoneBuilt >= game.sprites.cathedral.totalStonesToBuild) {
        s.gameOver.update()
    } else {
    // Check things to unlock
    this.unlockPhase()

    // Update each sprite
    s.click.cloneExecuteForEach('update')
    s.booster.cloneExecuteForEach('update')
    s.stock.cloneExecuteForEach('update')
    s.bonus.cloneExecuteForEach('update')
    s.particle.cloneExecuteForEach('update')

    s.cathedral.update()
    s.date.update()
    s.build.update()
    s.level.update()
    s.tuto.update()
    }


    //////////// TO REMOVE ////////////////
//    v.unlockPhase = 8
//    v.goldStock = 2000
//   game.sprites.cathedral.buildStones(50)
//    v.stoneBuilt+=50
    ///////////////////////////////////////

}
