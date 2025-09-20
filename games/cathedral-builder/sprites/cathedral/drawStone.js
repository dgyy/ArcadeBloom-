//////////////////////
// Draw a stone 
//////////////////////
game.sprites.cathedral.drawStone = function(ctx, stone) {
    // Shortcuts
    let cube =  game.engine3D.cube
    let spriteHeight = this.height
    let stoneSize = this.stoneSize
    // Normal stone aspect
    cube.frontStyle = {lineWidth: 1, strokeStyle: '#876552', fillStyle: '#FFDDCA'}
    cube.topStyle = {lineWidth: 1, strokeStyle: '#876552', fillStyle: '#FFDDCA'}
    cube.bottomStyle = {lineWidth: 1, strokeStyle: '#411F0C', fillStyle: '#876552'}
    cube.leftStyle = {lineWidth: 1, strokeStyle: '876552', fillStyle: '#FFDDCA'}
    cube.rightStyle = {lineWidth: 1, strokeStyle: '#411F0C', fillStyle: '#876552'}
    // Define stone size
    cube.size = {x:stoneSize.x, y:stoneSize.y, z:stoneSize.z}
    // Calculate stone coordinates
    let stoneCoordinates = {
        x: stone.x * cube.size.x,
        y: spriteHeight - stone.y * cube.size.y,
        z: stone.z * cube.size.z
    }
    cube.position = stoneCoordinates
    // Draw stone
    cube.draw(ctx)
}
