game.sprites.particle.create = function(x,y,nb,vXmin,vXmax) {

    // Shortcuts
    rdmn = game.utils.getRandomNumber
    rdmi = game.utils.getRandomInteger

    // Create particles
    for (let i=0;i<nb;i++) {
        let p = this.cloneCreate()
        let size = rdmi(10,20)
        p.r = rdmi(55,75)
        p.g = rdmi(20,40)
        p.b = rdmi(0,20)
        p.x = x
        p.y = y
        p.vX = rdmn(vXmin,vXmax)
        p.vY = rdmn(-10,0)
        p.width = size
        p.height = size
        p.isVisible = true
        p.drawBundaries = true
    }
}