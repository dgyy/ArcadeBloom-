import { AABB } from "./aabb";
import { Context } from "./canvas";
import { SCREEN_HEIGHT } from "./constants";
import { SeasonPalette, getActiveSeason } from "./season";

export class PlayingField extends AABB {
    public color: SeasonPalette = {
        spring: '#cad648',
        summer: '#cad648',
        winter: '#48b5d6',
        fall: '#d6c148',
    };
    
    public draw(ctx: Context) {
        ctx.save();
        ctx.strokeStyle = this.color[getActiveSeason()];
        ctx.lineWidth = 2;
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(this.pos.x + this.width / 4, SCREEN_HEIGHT / 2);
        ctx.lineTo(this.pos.x + this.width - this.width / 4, SCREEN_HEIGHT / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.x + this.width / 2, SCREEN_HEIGHT / 2 - 20);
        ctx.lineTo(this.pos.x + this.width / 2, SCREEN_HEIGHT / 2 + 20);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.x - 20, SCREEN_HEIGHT / 2);
        ctx.lineTo(this.pos.x + 20, SCREEN_HEIGHT / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.x + this.width - 20, SCREEN_HEIGHT / 2);
        ctx.lineTo(this.pos.x + this.width + 20, SCREEN_HEIGHT / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}