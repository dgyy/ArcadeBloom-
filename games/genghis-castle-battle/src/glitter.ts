import { Context } from "./canvas";
import { hsla } from "./color";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { randomInt } from "./random";
import { getActiveSeason } from "./season";
import { Vector2 } from "./vector";

const hsl = 'hsl(30, 53.60%, 67.10%)'
export class Glitter {
    public angle = 0;
    public centerX: number;
    public range = .5;
    public fadeIn = true;
    public opacityIncrement = 0.001;

    public color = {
        summer: [65, 59, 60],
        winter: [194, 63, 56],
        spring: [311, 36, 85],
        fall: [30, 53, 67],
    };

    constructor(public pos: Vector2, public vel: Vector2, public opacity: number) {
        this.centerX = this.pos.x;
    }

    public update(dt: number) {
        this.pos.x = this.centerX + Math.sin(this.angle) * this.range;
        this.pos.y -= this.vel.y;
        this.angle += this.vel.x;

        if (this.fadeIn) {
            this.opacity += this.opacityIncrement;
        } else {
            this.opacity -= this.opacityIncrement;
        }

        if (this.opacity > 1) {
            this.fadeIn = false;
        }

        if (this.pos.y < 0 || this.opacity < 0) {
            this.pos.x = randomInt(0, SCREEN_WIDTH);
            this.pos.y = randomInt(0, SCREEN_HEIGHT);
            this.fadeIn = true;
            this.opacity = 0;
        }
    }

    public draw(ctx: Context) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        const [h, s, l] = this.color[getActiveSeason()];
        ctx.fillStyle = hsla(h, s, l, this.opacity);
        ctx.fillRect(0, 0, 3, 3);
        ctx.restore();
    }
}
