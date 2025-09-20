// init game entities


let monsters = new Array(10).fill().map(_ => {
    return {
        type: 'monster',
        sprite: monstersSprites,
        life: 0,
        x: 0,
        y: 0,
        t: 0,
        theta: 0,
        speed: 0
    }
})


let arrows = new Array(1000).fill().map(_ => {
    return {
        type: 'arrow',
        x: 0,
        y: 0,
        speed: 1,
        theta: 0,
        life: 0,
        sprite: arrowsSprite
    }
})
