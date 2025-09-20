game.sprites.date.update = function (ctx) {

    // Shortcuts
    let v = game.variables

    // Check if is visible
    if (v.unlockPhase >= 5) {this.isVisible = true}

    // Update year and month
    if (performance.now() - this.lastChange > 200) {
        this.lastChange = performance.now()
        if (v.month == 12) {
            v.month = 1
            v.year += 1
        } else {
            v.month+=1
        }
    }
}