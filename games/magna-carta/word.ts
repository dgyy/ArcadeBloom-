import { Draggable } from "./engine/draggable";
import { Mouse } from "./engine/mouse";
import { Vector, offset } from "./engine/vector";
import { Game } from "./game";
import { roundRect } from "./engine/drawing";
import { tileBorder, tileColor } from "./colors";
import { Pulse } from "./engine/pulse";
import { random } from "./engine/random";
import { moveTowards } from "./engine/math";
import { transformTo } from "./engine/transformer";

export const TILE_SIZE = 30;

export class Word extends Draggable {
    private rotated = false;
    private rightClicked = false;
    private spaced = false;
    private rotation = 0;
    private original: string;
    private blocked: boolean;
    private time: number;
    private bulge = 0;

    private prevPos = { x: 0, y: 0 };

    constructor(private word: string, x: number, y: number, private game: Game) {
        super(x, y, TILE_SIZE * word.length, TILE_SIZE);
        this.original = word;
    }

    public getScore(): number {
        return this.blocked ? 0 : this.word.length;
    }

    public isDragging(): boolean {
        return this.dragging;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);

        this.time = tick;

        if(this.dragging && (this.rightClicked && !mouse.right || this.spaced && !mouse.space)) {

            this.game.addEffect(new Pulse(this.p.x + this.offset.x, this.p.y + this.offset.y, 50, 0.8, 10, 100));

            this.rotation = (this.rotation + 1) % 4;
            this.rotated = this.rotation % 2 == 1;
            this.word = this.rotation > 1 ? this.original.split("").reverse().join("") : this.original;
            this.offset = { x: this.offset.y, y: this.offset.x };
            this.game.markRotate();

            this.game.audio.rotate();
        }

        this.bulge = moveTowards(this.bulge, 0, 0.05);

        this.rightClicked = mouse.right;
        this.spaced = mouse.space;

        const dx = this.rotated ? 0 : 1;
        const dy = this.rotated ? 1 : 0;
        this.s = {
            x: TILE_SIZE + (this.word.length - 1) * TILE_SIZE * dx,
            y: TILE_SIZE + (this.word.length - 1) * TILE_SIZE * dy
        };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.font = "15px arial black";
        ctx.textAlign = "center";

        if(this.dragging) {
            const snap = this.getSnapPos();
            ctx.strokeStyle = "#fff9";
            ctx.lineWidth = 5;
            ctx.setLineDash([5, 5]);
            roundRect(ctx, snap.x + 2, snap.y + 2, this.s.x - 4, this.s.y - 4, 5);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const dx = this.rotated ? 0 : 1;
        const dy = this.rotated ? 1 : 0;

        if(this.hovered || this.dragging) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 7;
            ctx.strokeRect(this.p.x - 3, this.p.y - 3, this.s.x + 3, this.s.y + 3);
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(this.p.x - 3, this.p.y - 3, this.s.x + 3, this.s.y + 3);

        ctx.fillStyle = tileBorder;
        ctx.fillRect(this.p.x, this.p.y, this.s.x - 3, this.s.y - 3);

        const snap = this.getSnapPos();

        const letters = this.word.split("").map((letter, i) => {
            const p = { x: this.p.x + i * TILE_SIZE * dx + TILE_SIZE * 0.5, y: this.p.y + i * TILE_SIZE * dy + TILE_SIZE * 0.5 };
            const snapped = offset(snap, i * TILE_SIZE * dx, i * TILE_SIZE * dy);
            const others = this.game.collides(p, this);

            return {
                point: p,
                letter,
                clash: others.length > 0,
                bad: others.some(o => !o.is(snapped, letter)),
                outside: !this.game.isInGrid(snapped)
            } as Letter;
        });

        this.blocked = letters.some(l => l.outside || l.bad);
        const partial = letters.some(l => !l.outside) && this.blocked;

        letters.forEach((letter, i) => {
            ctx.fillStyle = tileColor;
            if(letter.clash || partial && letter.outside) ctx.fillStyle = letter.bad || letter.outside ? "pink" : "#F1EE95";
            ctx.fillRect(this.p.x + i * TILE_SIZE * dx, this.p.y + i * TILE_SIZE * dy, TILE_SIZE - 3, TILE_SIZE - 3);
            ctx.fillStyle = "#000";
            const offset = this.dragging || this.hovered ? Math.sin(this.time * 0.008 + i * Math.PI * 0.1) * 2 : 0;
            const p = { x: this.p.x + i * TILE_SIZE * dx + TILE_SIZE * 0.5 - 1, y: this.p.y + 19 + i * TILE_SIZE * dy + offset };
            ctx.save();
            const phase = Math.abs(Math.sin(this.bulge * Math.PI));
            const bulgeAmount = 1 + phase * 0.4;
            transformTo(ctx, p.x, p.y - 5, 0, bulgeAmount, bulgeAmount);
            ctx.fillText(letter.letter, p.x, p.y);
            ctx.restore();
            if(letter.clash || letter.bad || partial && letter.outside) {
                ctx.strokeStyle = letter.bad || letter.outside ? "#D5573B" : "#000";
                ctx.setLineDash([]);
                ctx.lineWidth = 4;
                ctx.strokeRect(this.p.x + i * TILE_SIZE * dx - 2, this.p.y + i * TILE_SIZE * dy - 2, TILE_SIZE + 1, TILE_SIZE + 1);

                if(!letter.outside && (snap.x != this.prevPos.x || snap.y != this.prevPos.y) && letter.clash && !letter.bad) {
                    this.game.addEffect(new Pulse(snap.x + i * dx * TILE_SIZE + TILE_SIZE * 0.5, snap.y + i * dy * TILE_SIZE + TILE_SIZE * 0.5, 40, random(0.8, 0.9), 5, 60));
                }
            }
        });

        this.prevPos = snap;
    }

    private is(point: Vector, letter: string): boolean {
        const index = this.rotated ? (point.y - this.p.y) / TILE_SIZE : (point.x - this.p.x) / TILE_SIZE;
        return this.word.at(index) === letter;
    }

    protected hover(): void {
        this.game.currentDepth++;
        this.d = this.game.currentDepth;
        this.game.audio.blip();
    }

    protected exit(): void {
    }

    protected pick(): void {
        this.game.currentDepth++;
        this.d = this.game.currentDepth;
        this.game.hideBubble();
        this.game.hideLogo();
        this.game.audio.pick();
    }

    protected click(): void {
    }

    protected drop(): void {
        this.p = this.getSnapPos();
        const p = offset(this.p, TILE_SIZE * 0.5, TILE_SIZE * 0.5);
        this.game.evaluate();
        this.game.audio.drop();
        this.bulge = 1;
    }

    private getSnapPos(): Vector {
        return {
            x: Math.round(this.p.x / TILE_SIZE) * TILE_SIZE,
            y: Math.round(this.p.y / TILE_SIZE) * TILE_SIZE
        };
    }
}

interface Letter {
    point: Vector;
    letter: string;
    clash: boolean;
    bad: boolean;
    outside: boolean;
}