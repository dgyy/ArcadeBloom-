import { drawCircle, drawEllipse } from "./drawing";
import { Entity } from "./entity";
import { Eye } from "./eye";
import { moveTowards } from "./math";
import { Mouse } from "./mouse";
import { random } from "./random";

export class Face extends Entity {
    private openess = 0;
    private targetOpeness = 0;
    private closeTimer: any;

    private left = new Eye(-50, 0, 10);
    private right = new Eye(50, 0, 10);

    constructor(blinkDuration: number, blinkDiff: number, private blushColor: string) {
        super(0, 0, 0, 0);
        this.blink(blinkDuration, blinkDiff);
    }

    private blink(blinkDuration: number, blinkDiff: number): void {
        setTimeout(() => this.left.blink(blinkDuration), random(0, blinkDiff));
        setTimeout(() => this.right.blink(blinkDuration), random(0, blinkDiff));
        setTimeout(() => this.blink(blinkDuration, blinkDiff), random(1000, 4000));
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.openess = moveTowards(this.openess, this.targetOpeness, 0.075);
        this.left.update(tick, mouse);
        this.right.update(tick, mouse);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        drawEllipse(ctx, { x: -65, y: 20 }, 15, 10, this.blushColor);
        drawEllipse(ctx, { x: 65, y: 20 }, 15, 10, this.blushColor);

        // mouth
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.moveTo(-40, 20);
        ctx.quadraticCurveTo(0, 40 - 20 * this.openess, 40, 20);
        ctx.quadraticCurveTo(0, 40 + 60 * this.openess, -40, 20);
        ctx.stroke();
        ctx.fill();

        this.left.draw(ctx);
        this.right.draw(ctx);
    }

    public openMouth(amount: number, closeDelay: number): void {
        clearTimeout(this.closeTimer);
        this.targetOpeness = amount;
        this.closeTimer = setTimeout(() => this.closeMouth(), closeDelay * 1000);
    }

    public closeMouth(): void {
        this.targetOpeness = 0;
    }
}