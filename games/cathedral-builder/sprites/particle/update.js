game.sprites.particle.update = function (ctx) {
        // Particle speed
        this.vY+=0.5
        // Particle position
        this.x+=this.vX
        this.y+=this.vY
        //Opacity
        this.a-=0.02
        if(this.a<=0) {this.cloneDelete()}
}

