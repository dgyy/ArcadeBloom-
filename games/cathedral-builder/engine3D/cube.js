//////////////////////
// Cube object:
// render a cube
//////////////////////
game.engine3D.cube = {
    // down left point
    position: {x:100, y:100, z:0}, 
    size: {x:100, y:100, z:1},
    frontStyle: {lineWidth: 1, strokeStyle: 'black', fillStyle: 'grey'},
    topStyle: {lineWidth: 1, strokeStyle: 'black', fillStyle: 'grey'},
    bottomStyle: {lineWidth: 1, strokeStyle: 'black', fillStyle: 'grey'},
    leftStyle: {lineWidth: 1, strokeStyle: 'black', fillStyle: 'grey'},
    rightStyle: {lineWidth: 1, strokeStyle: 'black', fillStyle: 'grey'},
    draw: function(ctx) {
        // Shortcuts
        let position = this.position
        let size = this.size
        let frontStyle = this.frontStyle
        let topStyle = this.topStyle
        let bottomStyle = this.bottomStyle
        let leftStyle = this.leftStyle
        let rightStyle = this.rightStyle
        let projectPoint = game.engine3D.projectPoint
        let shape = game.engine3D.shape
        let vp = game.engine3D.vp
        // Calculate front face real coordinates
        let frontTopLeft = {x:position.x, y:position.y - size.y, z:position.z}
        let frontDownLeft = {x:position.x, y:position.y, z:position.z}
        let frontDownRight = {x:position.x + size.x, y:position.y, z:position.z}
        let frontTopRight = {x:position.x + size.x, y:position.y - size.y, z:position.z}
        // Calculate back face real coordinates
        let backTopLeft = {x:position.x, y:position.y - size.y, z:position.z + size.z}
        let backDownLeft = {x:position.x, y:position.y, z:position.z + size.z}
        let backDownRight = {x:position.x + size.x, y:position.y, z:position.z + size.z}
        let backTopRight = {x:position.x + size.x, y:position.y - size.y, z:position.z + size.z}
        // Project front face coordinates
        let projectedFrontTopLeft = projectPoint(frontTopLeft)
        let projectedFrontDownLeft = projectPoint(frontDownLeft)
        let projectedFrontDownRight = projectPoint(frontDownRight)
        let projectedFrontTopRight = projectPoint(frontTopRight)
        // Project back face coordinates
        let projectedBackTopLeft = projectPoint(backTopLeft)
        let projectedBackDownLeft = projectPoint(backDownLeft)
        let projectedBackDownRight = projectPoint(backDownRight)
        let projectedBackTopRight = projectPoint(backTopRight)
        // Draw front face
        shape.projectedPoints = []
        shape.projectedPoints.push(projectedFrontTopLeft, projectedFrontDownLeft, projectedFrontDownRight, projectedFrontTopRight)
        shape.closeShape = true
        shape.lineWidth = frontStyle.lineWidth
        shape.strokeStyle = frontStyle.strokeStyle
        shape.fillStyle = frontStyle.fillStyle
        shape.draw(ctx)
        // Draw top face
        if (position.y - size.y / 2 > vp.y) {
            shape.projectedPoints = []
            shape.projectedPoints.push(projectedFrontTopLeft, projectedFrontTopRight, projectedBackTopRight, projectedBackTopLeft)
            shape.closeShape = true
            shape.lineWidth = topStyle.lineWidth
            shape.strokeStyle = topStyle.strokeStyle
            shape.fillStyle = topStyle.fillStyle
            shape.draw(ctx)
        }
        // Draw bottom face
        if (position.y - size.y / 2 < vp.y) {
            shape.projectedPoints = []
            shape.projectedPoints.push(projectedFrontDownLeft, projectedBackDownLeft, projectedBackDownRight, projectedFrontDownRight)
            shape.closeShape = true
            shape.lineWidth = bottomStyle.lineWidth
            shape.strokeStyle = bottomStyle.strokeStyle
            shape.fillStyle = bottomStyle.fillStyle
            shape.draw(ctx)
        }
        // Draw left face
        if (position.x + size.x / 2 > vp.x) {
            shape.projectedPoints = []
            shape.projectedPoints.push(projectedFrontDownLeft, projectedBackDownLeft, projectedBackTopLeft, projectedFrontTopLeft)
            shape.closeShape = true
            shape.lineWidth = leftStyle.lineWidth
            shape.strokeStyle = leftStyle.strokeStyle
            shape.fillStyle = leftStyle.fillStyle
            shape.draw(ctx)
        }
        // Draw right face
        if (position.x + size.x / 2 < vp.x) {
            shape.projectedPoints = []
            shape.projectedPoints.push(projectedFrontTopRight, projectedFrontDownRight, projectedBackDownRight, projectedBackTopRight)
            shape.closeShape = true
            shape.lineWidth = rightStyle.lineWidth
            shape.strokeStyle = rightStyle.strokeStyle
            shape.fillStyle = rightStyle.fillStyle
            shape.draw(ctx)
        }        
    }
}
