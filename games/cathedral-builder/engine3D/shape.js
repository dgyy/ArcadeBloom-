//////////////////////
// Shape object :
// render a path
//////////////////////
game.engine3D.shape = {
    projectedPoints:[{x:100,y:100},{x:200,y:200},{x:100,y:200}],
    closeShape:true,
    lineWidth: 2,
    strokeStyle: 'black',
    fillStyle: 'red',
    draw: function (ctx) {
        // Configure rendering style
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillStyle
        ctx.strokeStyle = this.strokeStyle
        // Path
        ctx.beginPath ()
        // Move to first point
        let startPoint = this.projectedPoints[0]
        ctx.moveTo(startPoint.x, startPoint.y)
        // Lines to each point
        for (let i = 1; i<this.projectedPoints.length; i+=1) {
            let point = this.projectedPoints[i]
            ctx.lineTo(point.x, point.y)
        }
        // Close path if relevant
        if (this.closeShape) {
            ctx.lineTo(startPoint.x, startPoint.y)
        }
        // Draw in canvas
        ctx.fill()
        ctx.stroke()
    }
}