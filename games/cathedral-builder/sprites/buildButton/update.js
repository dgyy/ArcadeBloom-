game.sprites.build.update = function (ctx) {
    // Shortcuts
    let id = this.id
    let v = game.variables
    let now = performance.now()
    let speed = v.buildSpeed

    // Check if is visible
    if(v.unlockPhase >= 3) {this.isVisible = true}

    // If click then 1s auto click
    if (this.isClicked) {v.buildAutoClickUntil = now+1000}

    // Check if auto click applies
    let autoClick = false
    if (now < v.buildAutoClickUntil) {autoClick = true}

    // Build if there are enough stones
    if (v.stoneStock >= speed && autoClick && now > this.lastClick + 50) {
        game.sprites.cathedral.buildStones(speed)
        v.stoneStock-=speed    
        v.stoneBuilt+=speed    
        this.lastClick = now
        // particles
        game.sprites.particle.create(300,150,1,8,12)
    }
}
