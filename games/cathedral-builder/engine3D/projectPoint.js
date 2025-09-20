//////////////////////
// Project a point in the
// canvas coordinates
//////////////////////
game.engine3D.projectPoint = function(point) {
    let vp = game.engine3D.vp
    // apply a logarithmic scale for z length
    let depthRatio = Math.log10(1+point.z/10)
    // calculate projected coordinates
    let projectedX = point.x - depthRatio * (point.x - vp.x)
    let projectedY = point.y - depthRatio * (point.y - vp.y)
    return {x:projectedX, y:projectedY}
}
