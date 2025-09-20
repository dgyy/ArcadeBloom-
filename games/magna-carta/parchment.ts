import { skinColor } from "./colors";
import { Container } from "./engine/container";
import { drawEllipse } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { ZERO } from "./engine/vector";
import { TextEntity } from "./engine/text";
import { TILE_SIZE } from "./word";

export class Parchment extends Entity {
    private score = 0;
    private targetScore = 0;

    private ui = new Container(0, 0, [
        new TextEntity("0% DONE", 18, 750, 612, -1, ZERO, { align: "right", color: "#D5573B99" }),
        new TextEntity("0", 28, 750, 216, -1, ZERO, { align: "right", color: "#D5573B99" })
    ]);
    
    constructor() {
        super(0, 0, 0, 0);
        this.scale = { x: 1, y: 0 };
        setTimeout(() => this.open(), 1100);
    }

    public open(): void {
        this.tween.scale({ x: 1, y: 1 }, 0.5);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.ui.update(tick, mouse);
        const diff = this.targetScore >= this.score ? Math.min((this.targetScore - this.score), 100) : Math.max((this.targetScore - this.score), -100);
        this.score = this.score + diff;
        (this.ui.getChild(1) as TextEntity).content = this.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    public setTexts(done: string, score: number): void {
        (this.ui.getChild(0) as TextEntity).content = done;
        this.targetScore = score;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(TILE_SIZE * 2, 0);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = skinColor;

        ctx.save();
        ctx.translate(382.5, 585);
        ctx.scale(1, this.scale.y);
        ctx.translate(-382.5, -585);
        ctx.beginPath();
        ctx.rect(405, 215, 360, 370);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#D5573B22";
        for(let i = 0; i < 11 * 11; i++) {
            ctx.fillRect(
                TILE_SIZE * 14 + (i % 11) * TILE_SIZE,
                TILE_SIZE * 8 + Math.floor(i / 11) * TILE_SIZE,
                TILE_SIZE - 3,
                TILE_SIZE - 5
            );
        }

        ctx.restore();

        const topPos = 360 - 360 * this.scale.y;

        ctx.beginPath();
        ctx.moveTo(390, 185 + topPos);
        ctx.quadraticCurveTo(375, 205 + topPos, 390, 225 + topPos);
        ctx.lineTo(780, 225 + topPos);
        ctx.lineTo(780, 185 + topPos);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.ui.getChild(1).p = { x: 745, y: 216 + topPos };

        drawEllipse(ctx, { x: 390 + 390, y: 205 + topPos }, 10, 20, skinColor);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(390, 585);
        ctx.quadraticCurveTo(375, 605, 390, 625);
        ctx.lineTo(780, 625);
        ctx.lineTo(780, 585);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        drawEllipse(ctx, { x: 390 + 390, y: 605 }, 10, 20, skinColor);
        ctx.stroke();

        this.ui.draw(ctx);

        ctx.restore();
    }
}