//////////////////////
// Clear cathedral 
//////////////////////
game.sprites.cathedral.clear = function() {
    // Shortcuts
    let w = this.width
    let h = this.height
    // Init variables
    this.curStone=0
    this.builtStones=0
    // Clear canvas
    this.canvas0.ctx.clearRect(0,0,w,h)
    this.canvas50.ctx.clearRect(0,0,w,h)
    this.canvas90.ctx.clearRect(0,0,w,h)
    this.canvas110.ctx.clearRect(0,0,w,h)
}
