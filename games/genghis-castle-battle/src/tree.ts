import { Context } from "./canvas";
import { choose } from "./random";
import { SeasonPalette, getActiveSeason } from "./season";
import { Vector2 } from "./vector";

const positions: [number, number][] = [
    [92, 475],
    [176, 287],
    [58, 244],
    [31, 354],
    [159, 443],
    [61, 575],
    [198, 14],
    [134, 92],
    [117, 261],
    [46, 16],
    [217, 236],
    [97, 146],
    [221, 511],
    [142, 522],
    [197, 579],
    [157, 188],
    [0, 134],
    [34, 508],
    [112, 348],
    [121, 4],
    [205, 96],
    [134, 587],
    [218, 413],
    [5, 422],
    [63, 92],
    [223, 340],
    [85, 402],
    [14, 289],
    [221, 171],
    [0, 595],
    [776, 159],
    [584, 514],
    [742, 373],
    [736, 562],
    [809, 492],
    [629, 60],
    [710, 250],
    [624, 225],
    [665, 308],
    [776, 311],
    [633, 387],
    [563, 287],
    [654, 148],
    [602, 593],
    [770, 18],
    [759, 434],
    [712, 190],
    [669, 544],
    [639, 483],
    [560, 67],
    [573, 141],
    [748, 500],
    [806, 100],
    [705, 74],
    [562, 379],
    [571, 441],
    [665, 0],
    [699, 421],
    [594, 8],
    [775, 242]
];

export class TreeSegment {
    public angle = 0;
    public vr: number;
    public maxRotation: number;

    constructor(
        public radius: number,
        public color: SeasonPalette,
        public pos: Vector2,
    ) {
    }

    public update(dt: number) {
        this.angle += this.vr;
        if (Math.abs(this.angle) > this.maxRotation) {
            this.vr = this.vr * -1;
        }
    }

    public draw(ctx: Context) {
        ctx.save();
        ctx.fillStyle = this.color[getActiveSeason()];
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(0, - this.radius);
        ctx.arc(0, 0, this.radius, 0, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

export class Tree {
    public stumpColor = '#673d33';
    public topColor: SeasonPalette = {
        summer: "#afba38",
        spring: "#afba38",
        winter: "#d5eef1",
        fall: "#c0be3d",
    };
    public middleColor: SeasonPalette = {
        summer: "#75a535",
        spring: "#75a535",
        winter: "#64b5ce",
        fall: "#caab20"
    };
    public bottomColor: SeasonPalette = {
        summer: "#316a26",
        spring: "#316a26",
        winter: "#547fb1",
        fall: "#8f6e15"
    };

    public topSegment: TreeSegment;
    public middleSegment: TreeSegment;
    public bottomSegment: TreeSegment;

    public sway: number;

    constructor(public size: number, public pos: Vector2) {
        this.sway = choose(.05, .2);

        const topRadius = this.size * .7;
        const middleRadius = this.size * .9;
        const bottomRadius = this.size;

        const middlePos = new Vector2(this.pos.x, this.pos.y - middleRadius / 2);
        const topPos = new Vector2(this.pos.x, middlePos.y - topRadius / 2);

        this.topSegment = new TreeSegment(topRadius, this.topColor, topPos);
        this.middleSegment = new TreeSegment(middleRadius, this.middleColor, middlePos);
        this.bottomSegment = new TreeSegment(bottomRadius, this.bottomColor, this.pos);

        for (const segment of [this.topSegment, this.bottomSegment, this.middleSegment]) {
            segment.maxRotation = this.sway;
            segment.vr = this.sway / 50;
        }
    }

    public update(dt: number) {
        this.topSegment.update(dt);
        this.middleSegment.update(dt);
        this.bottomSegment.update(dt);
    }

    public draw(ctx: Context) {
        this.drawStump(ctx);
        this.bottomSegment.draw(ctx);
        this.middleSegment.draw(ctx);
        this.topSegment.draw(ctx);
    }

    public drawStump(ctx: Context) {
        const stumpWidth = this.size / 2;
        const stumpHeight = this.size * 1.1;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = this.stumpColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-stumpWidth * .6, 0);
        ctx.lineTo(-stumpWidth, stumpHeight);
        ctx.lineTo(0, stumpHeight * 1.1);
        ctx.lineTo(stumpWidth, stumpHeight);
        ctx.lineTo(stumpWidth * .6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    public overlaps(tree: Tree): boolean {
        const { x, y } = this.pos;
        const distance = Math.sqrt(Math.pow(tree.pos.x - x, 2) + (Math.pow(tree.pos.y - y, 2)));
        return distance <= (this.bottomSegment.radius + tree.bottomSegment.radius) &&
            distance >= Math.abs(this.bottomSegment.radius - tree.bottomSegment.radius);
    }
}

export const trees = positions.map(([x, y]) => new Tree(30, new Vector2(x, y)));