game.sprites.click.init = function() {
    
    // Init sprit properties
    this.width = 170
    this.height = 90
    this.isVisible = false
    //this.drawBoundaries=true

    // Define additional properties
    this.id = ""
    this.text = ""
    this.startTime = performance.now()
    this.isStarted = false
    this.progress = 0

    // Create "rock" button
    let rockButton = this.cloneCreate()
    rockButton.id = "rockButton"
    rockButton.text = "DIG"
    rockButton.x = 210
    rockButton.y = 245

    // Create "stone" button
    let stoneButton = this.cloneCreate()
    stoneButton.id = "stoneButton"
    stoneButton.text = "CUT"
    stoneButton.x = 210
    stoneButton.y = 365

    // Create "gold" button
    let goldButton = this.cloneCreate()
    goldButton.id = "goldButton"
    goldButton.text = "BEG"
    goldButton.x = 210  
    goldButton.y = 485
}
