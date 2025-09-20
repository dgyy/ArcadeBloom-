import { bgColor } from "./colors";
import { Blinders } from "./engine/blinders";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { random } from "./engine/random";
import { RectParticle } from "./engine/rect";
import { transformTo } from "./engine/transformer";
import { Vector, ZERO, offset } from "./engine/vector";
import { HEIGHT, WIDTH } from "./index";
import { King } from "./king";
import { Parchment } from "./parchment";
import { TextEntity } from "./engine/text";
import { TILE_SIZE, Word } from "./word";
import { WobblyText } from "./engine/wobbly";
import { Dog } from "./dog";
import { LineParticle } from "./engine/line";
import { Pulse } from "./engine/pulse";
import { AudioManager } from "./engine/audio";
import { song } from "./song";

const text = [
    "JOHN",
    "by",
    "the",
    "grace",
    "of",
    "God",
    "King",
    "of",
    "England",
    "Lord",
    "of",
    "Ireland",
    "Duke",
    "of",
    "Normandy",
    "and",
    "Aquitaine",
    "and",
    "Count",
    "of",
    "Anjou",
    "to",
    "his",
    "archbishops",
    "bishops",
    "abbots",
    "earls",
    "barons",
    "justices",
    "foresters",
    "sheriffs",
    "stewards",
    "servants",
    "and",
    "to",
    "all",
    "his",
    "officials",
    "and",
    "loyal",
    "subjects",
    "Greeting"
];

const wordsPerLine = [7,5,4,4,3,1,1,1,2,1,1,1,1,1,4,1,2,1,1];

export class Game extends Entity {
    public currentDepth = 0;

    private words: Word[] = [];
    private blinders: Blinders;
    
    private hasRotated: boolean;
    private effects = new Container();
    private kingTimer: any;
    private parchment = new Parchment();

    private phase = 1;
    private prevScore = 0;

    private fgEffects = new Container(450, 325);

    private king = new King(this);
    private dog = new Dog(this);

    private ui = new Container(0, 0, [
        new WobblyText("MAGNA CARTA", 80, 100, 580, 0.6, 5, { align: "left", outline: 20, spacing: 5 }),
        new WobblyText("by Antti Haavikko", 35, 240, 630, 0.2, 5, { align: "left", outline: 12, spacing: 5 })
    ]);
    
    constructor(private camera: Camera, public audio: AudioManager) {
        super(0, 0, 0, 0);
        audio.prepare(song);
        let x = 0;
        let y = 0;
        let count = 0;
        text.forEach((w, i) => {
            this.words.push(new Word(w.toUpperCase(), TILE_SIZE + TILE_SIZE * x, TILE_SIZE + y * TILE_SIZE, this));
            count++;
            x += w.length;
            if(count >= wordsPerLine[y]) {
                count = 0;
                x = 0;
                y++;
            }
        });
        this.blinders = new Blinders(900, 650);
    }

    public addEffect(e: Entity): void {
        this.effects.add(e);
    }

    public addBits(pos: Vector, amount: number): void {
        for(let i = 0; i < amount; i++) {
            this.effects.add(new RectParticle(pos.x, pos.y, 5, 5, 1, { x: random(-3, 3), y: random(-8, 0) }, { force: { x: 0, y: 0.2 }, color: "#fff3" }));
        }
    }

    public update(tick: number, mouse: Mouse): void {
        this.phase = Math.abs(Math.sin(tick * 0.002));
        super.update(tick, mouse);
        [...this.words].sort((a, b) => b.d - a.d).forEach(w => w.update(tick, mouse));
        this.king.update(tick, mouse);
        this.dog.update(tick, mouse);
        this.effects.update(tick, mouse);
        this.blinders.update(tick, mouse);
        this.parchment.update(tick, mouse);
        this.ui?.update(tick, mouse);
        this.fgEffects.update(tick, mouse);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 900, 650);

        ctx.strokeStyle = "#777DA725";
        ctx.lineCap = "round";
        
        this.drawDottedLine(ctx, 64, 0, 0, 0 + this.phase * 5);
        this.drawDottedLine(ctx, 48, 32 - 16, 32, 50 + this.phase * 7);
        this.drawDottedLine(ctx, 32, 32, 0, 80 + this.phase * 9);
        this.drawDottedLine(ctx, 32, 32, 32, 95 + this.phase * 11);
        this.drawDottedLine(ctx, 24, 40, 0, 110 + this.phase * 13);

        ctx.save();
        transformTo(ctx, 450, 325, Math.PI);
        this.drawDottedLine(ctx, 64, 0, 0, 0 + this.phase * 5);
        this.drawDottedLine(ctx, 48, 32 - 16, 32, 50 + this.phase * 7);
        this.drawDottedLine(ctx, 32, 32, 0, 80 + this.phase * 9);
        this.drawDottedLine(ctx, 32, 32, 32, 95 + this.phase * 11);
        this.drawDottedLine(ctx, 24, 40, 0, 110 + this.phase * 13);
        ctx.restore();

        ctx.lineCap = "butt";
        ctx.setLineDash([]);

        this.parchment.draw(ctx);

        this.effects.draw(ctx);
        [...this.words].sort(sortByDepth).forEach(w => w.draw(ctx));
        this.fgEffects.draw(ctx);
        this.king.draw(ctx);
        this.dog.draw(ctx);

        ctx.lineJoin = "round";
        this.ui?.draw(ctx);
        this.blinders.draw(ctx);
    }

    private drawDottedLine(ctx: CanvasRenderingContext2D, size: number, gap: number, x: number, y: number): void {
        ctx.lineWidth = size;
        ctx.setLineDash([0, size + gap]);
        ctx.lineDashOffset = x;
        ctx.beginPath();
        ctx.moveTo(0, 650 - y);
        ctx.lineTo(1500, 650 - y);
        ctx.stroke();
    }

    public isInGrid(point: Vector): boolean {
        return point.x > TILE_SIZE * 15 && point.x < TILE_SIZE * 27 && point.y > TILE_SIZE * 7 && point.y < TILE_SIZE * 19;
    }

    public collides(point: Vector, ignore: Word): Word[] {
        return this.words.filter(w => !w.isDragging() && w !== ignore && w.isInside(point));
    }

    public markRotate(): void {
        this.hasRotated = true;
    }

    public evaluate(): void {
        const score = this.words.reduce((total, w) => total + w.getScore(), 0);
        let frees = 0;
        for(let x = 0; x < 11; x++) {
            for(let y = 0; y < 11; y++) {
                if(this.collides({ x: TILE_SIZE * 16.5 + x * TILE_SIZE, y: TILE_SIZE * 8.5 + y * TILE_SIZE }, null).length == 0) frees++;
            }
        }
        const ratio = score / text.join("").length;
        const totalScore = Math.floor(score * score + frees * score);
        
        this.parchment.setTexts(Math.floor(ratio * 100) + "% DONE", totalScore);

        clearTimeout(this.kingTimer);

        // this.dog.hide();

        if(ratio >= 1) {
            this.king.show(["Good job!", "Didn't even know", "if a feat like", "that was possible!"]);
            this.kingTimer = setTimeout(() => this.king.hide(), 5000);
            this.dog.peek();
            return;
        }

        if(totalScore > 2000 && !this.hasRotated) {
            this.king.show(["You can also rotate", "the words by right", "clicking while", "dragging them..."]);
            return;
        }

        if(totalScore == 0) {
            this.king.showMessage([
                "Almost there!",
                "You need to fully",
                "fit the word on the",
                "parchment over there."
            ]);
        }

        if(totalScore > this.prevScore) {
            this.dog.peek();
        }

        this.prevScore = totalScore;

        if(totalScore > 0) {
            this.king.showMessage(["", "Yes indeed, just", "like that!", ""]);
            this.kingTimer = setTimeout(() => this.king.hide(), 2000);
            return;
        }
    }

    public hideBubble(): void {
        this.king.hideBubble();
    }

    public hideLogo(): void {
        if(!this.ui) return;
        this.ui.hide(0.3);
        setTimeout(() => this.ui = null);
    }
}