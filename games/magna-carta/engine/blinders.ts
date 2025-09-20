import { Entity } from "./entity";

export class Blinders extends Entity {
    constructor(w: number, h: number) {
        super(0, 0, w, h);
        this.d = 500;
        this.open();
    }

    public open(after = () => {}): void {
        this.tween.scale({ x: 0, y: 0}, 0.5);
        setTimeout(after, 500);
    }

    public close(after = () => {}): void {
        this.tween.scale({ x: 1, y: 1}, 0.4);
        setTimeout(after, 500);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.s.x * this.scale.x, this.s.y);
        ctx.fillRect(this.s.x - this.s.x * this.scale.x, 0, this.s.x * this.scale.x, this.s.y);
    }
}