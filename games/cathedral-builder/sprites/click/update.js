game.sprites.click.update = function (ctx) {
    // Shortcuts
    let id = this.id
    let v = game.variables

    // Check if button is visible
    if (id == 'rockButton' && v.unlockPhase >= 1) {this.isVisible = true}
    if (id == 'stoneButton' && v.unlockPhase >= 2) {this.isVisible = true}
    if (id == 'goldButton' && v.unlockPhase >= 6) {this.isVisible = true}

    
    // Check if auto click applies
    let autoClick = false
    if (id == 'rockButton' && performance.now() < v.rockAutoClickUntil) {autoClick = true}
    if (id == 'stoneButton' && performance.now() < v.stoneAutoClickUntil) {autoClick = true}
    if (id == 'goldButton' && performance.now() < v.goldAutoClickUntil) {autoClick = true}

    // Start the progress if the button is still not in progress, if prerequisites are OK and if buton is clicked
    if (!this.isStarted) {
        this.progress = 0
        if (id == 'rockButton' && (this.isClicked || autoClick)) {
            this.isStarted = true
            this.startTime = performance.now()
        } 
        if (id == 'stoneButton' && game.variables.rockStock >= 1 && (this.isClicked || autoClick)) {
            game.variables.rockStock-=1
            this.isStarted = true
            this.startTime = performance.now()
        } 
        if (id == 'goldButton' && (this.isClicked || autoClick)) {
            this.isStarted = true
            this.startTime = performance.now()
        }
    }

    // Claculate progress
    let speed = 0
    if (id=='rockButton') {speed = v.rockSpeed}
    if (id=='stoneButton') {speed = v.stoneSpeed}
    if (id=='goldButton') {speed = v.goldSpeed}

    if (this.isStarted) {
        this.progress = (performance.now()-this.startTime)/speed
        if (this.progress>=1) {this.progress=1}
    }

    // Update stocks and reset progress if progress is 100%
    if (this.progress==1) {
        this.progress = 0
        this.isStarted = false
        if (id == 'rockButton') {v.rockStock+=v.rockProduction } 
        if (id == 'stoneButton') {v.stoneStock+=v.stoneProduction} 
        if (id == 'goldButton') {v.goldStock+=v.goldProduction}
    }
}

