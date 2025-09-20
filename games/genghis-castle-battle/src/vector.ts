export class Vector2 {
    constructor(public x = 0, public y = 0) { }

    public moveTowards(point: Vector2, speed: number): void {
        const toVectorX = point.x - this.x;
        const toVectorY = point.y - this.y;

        const sqDist = toVectorX * toVectorX + toVectorY * toVectorY;

        if (sqDist == 0 || (speed >= 0 && sqDist <= speed * speed)) {
            return;
        }

        const dist = Math.sqrt(sqDist);

        this.x += (toVectorX / dist) * speed;
        this.y += (toVectorY / dist) * speed;
    }

    public distanceFrom(point: Vector2): number {
        const toVectorX = point.x - this.x;
        const toVectorY = point.y - this.y;

        const sqDist = toVectorX * toVectorX + toVectorY * toVectorY;

        return Math.sqrt(sqDist);
    }

    public copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}