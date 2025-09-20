//////////////////////
// Update scene
//////////////////////
game.scenes.boot.update = function() {
    // Shortcuts
    let s = game.sprites
    // Open main scene
    if (s.play.isClicked) {
        s.cathedral.clear()
        game.music.play()
        mge.game.changeScene(game.scenes.main)
    }
}
