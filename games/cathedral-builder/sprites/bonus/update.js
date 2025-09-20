game.sprites.bonus.update = function (ctx) {

    // Shortcuts
    let v = game.variables
    let nb = this.nb
    let now = performance.now()

    // Move 
    if (this.lastMove < now+100) {
        this.lastMove = now
        this.x+=this.xSpeed
        this.y+=this.ySpeed
        if (this.x > 1200 || this.x < 400) {
            this.xSpeed = this.xSpeed*-1
        }
        if (this.y > 650 || this.y < 100) {
            this.ySpeed = this.ySpeed*-1
        }
    }

    // Check if is clicked
    if (this.isClicked) {
        this.cloneDelete()
        if(this.type == 'rock') {
            v.rockStock += nb
        }
        if(this.type == 'stone') {
            v.stoneStock += nb
        }
        if(this.type == 'gold') {
            v.goldStock += nb
        }
        if(this.type == 'build') {
            game.sprites.cathedral.buildStones(this.nb)
        }
        if(this.type == 'autoclick') {
            let clickUntil = now+this.nb
            v.rockAutoClickUntil = clickUntil
            v.stoneAutoClickUntil = clickUntil
            v.goldAutoClickUntil = clickUntil
            v.buildAutoClickUntil = clickUntil
        }
    }
}