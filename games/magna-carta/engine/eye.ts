import { drawCircle, drawEllipse } from "./drawing";
import { Entity } from "./entity";
import { moveTowards } from "./math";
import { Mouse } from "./mouse";
import { ZERO } from "./vector";

export class Eye extends Entity {
    private openess = 1;
    private targetOpeness = 1;
    private timer: any;

    constructor(x: number, y: number, size: number) {
        super(x, y, size, size);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.openess = moveTowards(this.openess, this.targetOpeness, 0.075);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        drawEllipse(ctx, this.p, this.s.x, this.s.y * this.openess, "#000");
    }

    public blink(blinkDuration: number): void {
        clearTimeout(this.timer);
        this.targetOpeness = 0;
        this.timer = setTimeout(() => this.open(), blinkDuration);
    }

    private open(): void {
        this.targetOpeness = 1;
    }
}