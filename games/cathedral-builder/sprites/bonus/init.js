game.sprites.bonus.init = function() {
    
    // Init sprit properties
    this.width = 100
    this.height = 50
    this.isVisible = true
    //this.drawBoundaries=true
    this.x = 500
    this.y = 250

    // SVG paths
    this.up = new Path2D('M10 0 L90 0 L85 10 L15 10 L10 0')
    this.upRight = new Path2D('M85 10 L90 0 L100 10 L90 15 L85 10')
    this.right = new Path2D('M100 10 L100 40 L90 35 L90 15 L100 10')
    this.downRight = new Path2D('M85 40 L90 35 L100 40 L90 50 L85 40')
    this.down = new Path2D('M90 50 L10 50 L15 40 L85 40 L90 50')
    this.downLeft = new Path2D('M0 40 L10 35 L15 40 L10 50 L0 40')
    this.left = new Path2D('M0 10 L10 15 L10 35 L0 40 L0 10')
    this.upLeft = new Path2D('M0 10 L10 0 L15 10 L10 15 L0 10')
    this.center = new Path2D('M15 10 L85 10 L90 15 L90 35 L85 40 L15 40 L10 35 L10 15 L15 10')

    // specific attributes
    this.color = 'red'
    this.type = 'rock'
    this.nb = 10
    this.text = 'bonus'
    this.xSpeed = 3
    this.ySpeed = 1
    this.lastMove = 0
}
