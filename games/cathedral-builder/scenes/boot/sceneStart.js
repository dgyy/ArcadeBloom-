//////////////////////
// Start scene 
//////////////////////
game.scenes.boot.start = function() {
    // Shortcuts
    let s = game.sprites
    s.cathedral.init()
    s.click.init()
    s.build.init()
    s.booster.init()
    s.stock.init()
    s.date.init()
    s.play.init()
    s.level.init()
    s.tuto.init()
    s.bonus.init()
    s.gameOver.init()
    s.particle.init()
    s.logo.init()
    // Music
    game.music.createMusic()
}