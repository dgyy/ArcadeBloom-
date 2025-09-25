class Mouse extends EngineObject {
    constructor(pos, size, texture) {
        super(pos, size, texture);
        this.setCollision();
    }
    static speed = 0.2;
    collideWithObject(object) {
        if (object instanceof Cat) {
            game_state = "caught";
            stopAllMovement();
        }
        if (object instanceof Wall) {
            this.velocity = vec2(0, 0);
        }
        return true;
    }
}

class Cat extends EngineObject {
    constructor(pos, size, texture) {
        super(pos, size, texture);
        this.setCollision();
        this.sides = Wall._getSides(this.pos, this.size);
        this.corners = Wall._getCorners(this.sides);
        Laser.laserSolids.push(this);
    }
    static speed = 0.05;
    updateCat(laser) {
        this.velocity = laser.pos.subtract(this.pos).clampLength(Cat.speed);
        // this.mirror = this.velocity.x >= 0;
        // recalculate everything for next laser raycast
        this.sides = Wall._getSides(this.pos, this.size);
        this.corners = Wall._getCorners(this.sides);
    }
}

class Wall extends EngineObject {
    constructor(pos, size, texture) {
        super(pos, size, texture);
        this.setCollision();
        this.mass = 0;
        Wall.walls.push(this);
        Laser.laserSolids.push(this);
        this.sides = Wall._getSides(this.pos, this.size);
        this.corners = Wall._getCorners(this.sides);
    }
    static walls = [];
    static _getSides(pos, size) {
        return {
            top: pos.y + size.y / 2,
            left: pos.x - size.x / 2,
            right: pos.x + size.x / 2,
            bottom: pos.y - size.y / 2
        }
    }
    static _getCorners(sides) {
        return {
            topright: vec2(sides.right, sides.top),
            topleft: vec2(sides.left, sides.top),
            bottomright: vec2(sides.right, sides.bottom),
            bottomleft: vec2(sides.left, sides.bottom)
        }
    }
}

class Laser extends EngineObject {
    static laserSolids = [];
    constructor() {
        super(mouse.pos, vec2(0.3, 0.3));
        this.color = rgb(1, 0, 0)
    }
}

class Cheese extends EngineObject {
    constructor(pos, texture) {
        super(pos, vec2(2, 2), texture);
        this.setCollision();
    }
    collideWithObject(object) {
        if (object instanceof Mouse) {
            alert("WIN!");
            this.destroy()
        }
        return false;
    }
}