import { font } from "./constants";
import { Mouse } from "./mouse";
import { TextEntity, TextOptions } from "./text";
import { ZERO } from "./vector";

export class WobblyText extends TextEntity {
    private time = 0;

    constructor(content: string, fontSize: number, x: number, y: number, private frequency: number, private amplitude: number, options?: TextOptions) {
        super(content, fontSize, x, y, -1, ZERO, options);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.time = tick;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.rotate(this.options?.angle ?? 0);
        const mod = this.options?.scales ? this.ratio : 1;
        ctx.font =`${this.fontSize * mod}px ${font}`;
        ctx.textAlign = this.options?.align ?? "center";

        // if(this.options?.shadow) {
        //     ctx.fillStyle = "#000";
        //     ctx.fillText(this.content.replace(/\|/g, ""), this.p.x + this.options.shadow, this.p.y + this.options.shadow);
        // }
        
        const spacing = this.options?.spacing ?? 0;
        let offset = 0;
        this.content.split("").forEach((letter, i) => {
            if(this.options?.shadow) {
                ctx.fillStyle = "#000";
                ctx.fillText(letter, this.p.x + spacing * i + this.options.shadow + offset, this.p.y + this.options.shadow + Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude);
            }
            ctx.fillStyle = this.options?.color ?? "#fff";
            if(this.options?.outline) {
                ctx.strokeStyle = "#000";
                ctx.lineWidth = this.options.outline;
                ctx.strokeText(letter, this.p.x + spacing * i + offset, this.p.y + Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude);
            }
            ctx.fillText(letter, this.p.x + spacing * i + offset, this.p.y + Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude);
            offset += ctx.measureText(letter).width;
        });

        ctx.restore();
    }
}