import { Vector2 } from "./vector";

export class Projectile {
    public origin = new Vector2(0, 0);
    public position = new Vector2(0, 0);
    public velocity = new Vector2(8, 8);
    public width = 10;
    public height = 2;
    public finished = false;

    constructor(public parentId: string, public angle: number, origin: Vector2) {
        this.position.x = this.origin.x = origin.x;
        this.position.y = this.origin.y = origin.y;
    }

    public update() {
        this.position.x += Math.cos(this.angle) * this.velocity.x;
        this.position.y += Math.sin(this.angle) * this.velocity.y;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle)
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.restore();
    }
}