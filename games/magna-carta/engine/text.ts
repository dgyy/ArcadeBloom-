import { font } from "./constants";
import { drawColoredText } from "./drawing";
import { Particle } from "./particle";
import { Vector } from "./vector";

export class TextEntity extends Particle {
    constructor(public content: string, protected fontSize: number, x: number, y: number, life: number, velocity: Vector, protected options?: TextOptions) {
        super(x, y, 0, 0, life, velocity);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.rotate(this.options?.angle ?? 0);
        const mod = this.options?.scales ? this.ratio : 1;
        ctx.font =`${this.fontSize * mod}px ${font}`;
        ctx.textAlign = this.options?.align ?? "center";
        if(this.options?.shadow) {
            ctx.fillStyle = "#000";
            ctx.fillText(this.content.replace(/\|/g, ""), this.p.x + this.options.shadow, this.p.y + this.options.shadow);
        }
        drawColoredText(ctx, this.content, this.p.x, this.p.y, this.options?.color ?? "#fff", this.options?.markColors ?? []);
        ctx.restore();
    }
}

export interface TextOptions {
    color?: string;
    align?: CanvasTextAlign;
    shadow?: number;
    scales?: boolean;
    angle?: number;
    markColors?: string[];
    outline?: number;
    spacing?: number;
}