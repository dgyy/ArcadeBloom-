//////////////////////
// Draw a given number of new stones
// to the catedral canvas
//////////////////////
game.sprites.cathedral.buildStones = function(stonesNb) {
    // Shortcuts
    let curStone = this.curStone 
    let ctx0 = this.canvas0.ctx
    let ctx50 = this.canvas50.ctx
    let ctx90 = this.canvas90.ctx
    let ctx110 = this.canvas110.ctx
    let structure = this.structure
    // Get the real number of stone to build
    let realStonesNb = Math.min(stonesNb, structure.length - curStone)

    // Add new stones from structure
    for (let stoneNum = curStone; stoneNum < curStone + realStonesNb; stoneNum+=1) {
        let stone = this.structure[stoneNum]
        let offSetStone0 = {x:stone.x,y:stone.y,z:stone.z,type:stone.type} 
        let offSetStone50 = {x:stone.x,y:stone.y,z:stone.z,type:stone.type} 
        let offSetStone90 = {x:stone.x,y:stone.y,z:stone.z,type:stone.type} 
        let offSetStone110 = {x:stone.x,y:stone.y,z:stone.z,type:stone.type} 
        // Take into account camera offset
        offSetStone0.z -= 0
        offSetStone50.z -= 50
        offSetStone90.z -= 90
        offSetStone110.z -= 110
        // draw
        this.drawStone(ctx0,offSetStone0)
        this.drawStone(ctx50,offSetStone50)
        this.drawStone(ctx90,offSetStone90)
        this.drawStone(ctx110,offSetStone110)
        // Update number of stone already built
        this.builtStones +=1
    }
    // Update curStone
    this.curStone += realStonesNb
}

