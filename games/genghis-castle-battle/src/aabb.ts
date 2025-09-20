import { Vector2 } from "./vector";

export class AABB {
    constructor(public width = 0, public height = 0, public pos = new Vector2()) {
    }

    public intersects(aabb: AABB): boolean {
        return (
            this.pos.x <= aabb.pos.x + aabb.width &&
            this.pos.x + this.width >= aabb.pos.x &&
            this.pos.y <= aabb.pos.y + aabb.height &&
            this.pos.y + this.height >= aabb.pos.y
        );
    }

    public contains(aabb: Vector2): boolean {
        return false;
    }

    public containsPoint(point: Vector2): boolean {
        return this.pos.x <= point.x && point.x <= this.pos.x + this.width &&
            this.pos.y <= point.y && point.y <= this.pos.y + this.height;
    }
}