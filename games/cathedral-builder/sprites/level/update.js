game.sprites.level.update = function (ctx) {

    // Shortcuts
    let v = game.variables
    let bonus = game.sprites.bonus
    let rdm = game.utils.getRandomItem

    // Check if is visible
    if (v.unlockPhase >= 5) {this.isVisible = true}
    // Level reached
    if(v.stoneBuilt >= v.levelGoal) {
        // Get reward
        v.goldStock += v.levelGoldReward
        // Manage specific bonus and unlock phase
        if (v.level == 1) {
            bonus.create('stone',50)
        } else if (v.level == 2) {
        } else if (v.level == 3) {
            bonus.create('gold',10)
        } else if (v.level == 4) {
        } else {
            let type = rdm(['rock','stone','gold','autoclick'])
            if(type == 'rock') {bonus.create('rock',v.rockProduction * 5)}
            if(type == 'stone') {bonus.create('stone',v.stoneProduction * 5)}
            if(type == 'gold') {bonus.create('gold',v.goldProduction * 5)}
            if(type == 'autoclick') {bonus.create('autoclick',10000)}
        }
        // Increase cathedral build
        v.buildSpeed = Math.ceil(v.buildSpeed * 1.05)
        // Update level
        v.level+=1
        // Define new level goal and new reward
        if (v.level==15) {v.levelGoal = 34570} else {
            v.levelGoal = Math.ceil(v.levelGoal*1.5/100)*100
            v.levelGoldReward = Math.ceil(v.levelGoldReward*1.1)
        }
        // Particles
        game.sprites.particle.create(900,100,50,-3,3)
    }
}