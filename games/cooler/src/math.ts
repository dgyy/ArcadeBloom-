export class Vec2 {
    static from_angle = (n: number) => new Vec2(Math.cos(n), Math.sin(n))

    static make = (x: number, y: number) => new Vec2(x, y)

    static get zero() { return new Vec2(0, 0) }
    static get unit() { return new Vec2(1, 1) }

    get vs(): [number, number] {
        return [this.x, this.y]
    }


    get half() {
        return new Vec2(this.x/ 2, this.y/2)
    }

    get length_squared() {
        return this.x * this.x + this.y * this.y
    }


    get length() {
        return Math.sqrt(this.length_squared)
    }


    get normalize() {
        return this.length === 0 ? Vec2.zero : this.scale(1/ this.length)
    }

    get perpendicular() {
        return new Vec2(-this.y, this.x)
    }

    get clone() {
        return new Vec2(this.x, this.y)
    }

    get angle() {
        return Math.atan2(this.y, this.x)
    }

    constructor(public x: number, public y: number) {}


    dot(v: Vec2) {
        return this.x * v.x + this.y * v.y
    }

    cross(v: Vec2) {
        return this.x * v.y - this.y * v.x
    }

    distance(v: Vec2) {
        return this.sub(v).length
    }

    scale(n: number) {
        return new Vec2(this.x * n, this.y * n)
    }

    add(v: Vec2) {
        return new Vec2(this.x + v.x, this.y + v.y)
    }

    sub(v: Vec2) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    mul(v: Vec2) {
        return new Vec2(this.x * v.x, this.y * v.y)
    }


    add_angle(n: number) {
        return Vec2.from_angle(this.angle + n)
    }
}

export class Circle {
    static make = (x: number, y: number, r: number) => new Circle(Vec2.make(x, y), r)


    static get unit() { return Circle.make(0, 0, 1)}

    scale(n: number) { return Circle.make(this.o.x, this.o.y, this.r * n) }


    constructor(public o: Vec2, public r: number) {}
}