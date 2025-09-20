game.sprites.bonus.create = function(type,nb) {

    // Shortcuts
    let u = game.utils

    let bonus = this.cloneCreate()
    bonus.xSpeed = u.getRandomNumber(-3,3)
    if(bonus.xSpeed == 0) {bonus.xSpeed=1}
    bonus.ySpeed = u.getRandomNumber(-3,3)
    if(bonus.ySpeed == 0) {bonus.ySpeed=1}
    bonus.x = u.getRandomInteger(600,1000)
    bonus.y = 200
    bonus.type = type
    bonus.nb = nb
    bonus.text = type.toUpperCase()
}
