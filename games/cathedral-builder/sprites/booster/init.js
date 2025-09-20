game.sprites.booster.init = function() {
    
    // Init sprit properties
    this.width = 125
    this.height = 40
    this.isVisible = false
    //this.drawBoundaries=true

    // Define additional properties
    this.id = ""
    this.text = ""
    this.goldNeeded = 1
    this.disable = false

    // Create "Upgrade rock" button
    let upgradeRock = this.cloneCreate()
    upgradeRock.id = "upgradeRock"
    upgradeRock.text = "UPGRADE"
    upgradeRock.x = 368
    upgradeRock.y = 220

    // Create "Upgrade rock" button
    let upgradeStone = this.cloneCreate()
    upgradeStone.id = "upgradeStone"
    upgradeStone.text = "UPGRADE"
    upgradeStone.x = 368
    upgradeStone.y = 340

    // Create "Upgrade gold" button
    let upgradeGold = this.cloneCreate()
    upgradeGold.id = "upgradeGold"
    upgradeGold.text = "UPGRADE"
    upgradeGold.x = 368
    upgradeGold.y = 460

    // Create "Booster rock" button
    let boosterRock = this.cloneCreate()
    boosterRock.id = "boosterRock"
    boosterRock.text = "AUTO CLICK"
    boosterRock.x = 368
    boosterRock.y = 270

    // Create "Booster stone" button
    let boosterStone = this.cloneCreate()
    boosterStone.id = "boosterStone"
    boosterStone.text = "AUTO CLICK"
    boosterStone.x = 368
    boosterStone.y = 390

    // Create "Booster gold" button
    let boosterGold = this.cloneCreate()
    boosterGold.id = "boosterGold"
    boosterGold.text = "AUTO CLICK"
    boosterGold.x = 368
    boosterGold.y = 510
    
    // Create "Booster build" button
    let boosterBuild = this.cloneCreate()
    boosterBuild.id = "boosterBuild"
    boosterBuild.text = "AUTO CLICK"
    boosterBuild.height = 90
    boosterBuild.x = 368
    boosterBuild.y = 125

}

