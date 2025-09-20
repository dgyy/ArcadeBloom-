import {ICenterable, IGold, IPoint, IPoolable, IPoolPoint, IPositionable} from "./interfaces";
import {Bullet, BULLET_SIZES} from "./bullet";
import {drawPixels, updatePos} from "./game_objects";
import Grid from "./grid";
import {GLOBAL, PIXEL_SIZE} from "./constants";
import {addVectors, normalizeVector, subtractVectors} from "./math";


export class PointPool {
    private static available: IPoolPoint[] = [];

    static initialize(count: number): void {
        for (let i = 0; i < count; i++) {
            PointPool.available.push({x: 0, y: 0, active: false});
        }
    }

    static get(x: number = 0, y: number = 0): IPoolPoint {
        for (let i = 0; i < PointPool.available.length; i++) {
            const point = PointPool.available[i];
            if (!point.active) {
                point.x = x;
                point.y = y;
                point.active = true;
                return point;
            }
        }

        const point = {x, y, active: true};
        PointPool.available.push(point);
        console.warn("PointPool ran out of points.");
        return point;
    }

    static release(point: IPoolPoint) {
        point.x = 0;
        point.y = 0;
        point.active = false;
    }
}
export class BulletPool {
    public static available: Bullet[] = [];
    public static gameSize: IPoint = {x: 0, y: 0};
    public static grid: Grid;

    static initialize(count: number): void {
        for (let i = 0; i < count; i++) {
            BulletPool.available.push(new Bullet());
        }
    }

    static get(x: number, y: number): Bullet | null {
        if (!BulletPool.grid) return null;
        for (let i = 0; i < BulletPool.available.length; i++) {
            const bullet = BulletPool.available[i];
            if (!bullet.active) {
                bullet.active = true;
                updatePos(x, y, bullet);
                return bullet;
            }
        }

        const bullet = new Bullet();
        updatePos(x, y, bullet);
        console.warn("out of bullets.");
        BulletPool.available.push(bullet);
        return bullet;
    }

    static update(t: number) {
        // update bullets and deactivate them if they are out of bounds and reset their lifeTime and set them to inactive
        for (let i = 0; i < BulletPool.available.length; i++) {
            const bullet = BulletPool.available[i];
            if (bullet.active) {
                bullet.update(t);
            }

            if (bullet.pos.x < 0 || bullet.pos.x > BulletPool.gameSize.x|| bullet.pos.y < 0 || bullet.pos.y > BulletPool.gameSize.y || bullet.lifeTime > bullet.maxLifeTime) {
                BulletPool.release(bullet);
            }

        }
    }

    static draw(ctx: CanvasRenderingContext2D, scale: number = 1) {
        for (let i = 0; i < BulletPool.available.length; i++) {
            const bullet = BulletPool.available[i];
            if (bullet.active) {
                ctx.save();
                ctx.translate(bullet.center.x * scale, bullet.center.y * scale);
                ctx.rotate(bullet.angle);
                ctx.imageSmoothingEnabled = false;  // Ensure no smoothing for main canvas

                // draw bullet which is a square that rotates based on the bullets angle
                ctx.fillStyle = bullet.color;
                const percentLife = 1 - (Math.max(bullet.lifeTime, Number.EPSILON) / bullet.maxLifeTime);
                ctx.fillRect(-bullet.size.x*scale * percentLife, -bullet.size.y*scale* percentLife, bullet.size.x*scale* percentLife, bullet.size.y*scale * percentLife);

                ctx.restore();
            }
        }
    }

    static release(bullet: Bullet) {
        bullet.makeBullet();
        bullet.active = false;
        bullet.lifeTime = 0;
        bullet.size = BULLET_SIZES[0]
        bullet.radius = bullet.size.x/2

    }
}

export const GOLD_PIXELS = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
];

const GOLD_PIXELS_COLOR_MAP = [null, "#FFD700"];
const GOLD_PIXELS_COLOR_MAP2 = [null, "#ffe55e"];

const goldCanvas = document.createElement("canvas");
const goldCtx = goldCanvas.getContext("2d");
const goldCanvas2 = document.createElement("canvas");
const goldCtx2 = goldCanvas2.getContext("2d");
goldCanvas.width = GOLD_PIXELS[0].length * PIXEL_SIZE;
goldCanvas.height = GOLD_PIXELS.length * PIXEL_SIZE;
drawPixels(goldCtx, GOLD_PIXELS, GOLD_PIXELS_COLOR_MAP, PIXEL_SIZE);
drawPixels(goldCtx2, GOLD_PIXELS, GOLD_PIXELS_COLOR_MAP2, PIXEL_SIZE);
function updateIndividualGold(this: IGold, t: number) {
    if (!this.active) return;
    if (!this.updateable) return;

    if (!this.target) return;
    if (this.updateDelay === -1 || GLOBAL.absoluteTime < this.updateDelay) return;
    const direction = PointPool.get();

    subtractVectors(addVectors(this.target, this.offset, direction), this.center, direction)

    normalizeVector(direction, direction);

    let posX = this.target.x + this.offset.x;
    let posY = this.target.y + this.offset.y;

    if (!this.arrived) {
        const SPEED = 4;
        posX = this.pos.x + direction.x * SPEED;
        posY = this.pos.y + direction.y * SPEED;
        this.angle += .01 % 2* Math.PI;
    }

    updatePos(posX, posY, this);

    const distanceIncludingOffsets = Math.hypot(this.target.x - this.center.x + this.offset.x, this.target.y - this.center.y + this.offset.y);
    if (distanceIncludingOffsets < 5) {
        if (!this.arrived)  {
            this.arrived = true;
            this.arrivalCallback(this);
        }

        updatePos(this.target.x + this.offset.x, this.target.y + this.offset.y, this);
    }

    PointPool.release(direction);
}

export function createGold(x: number, y: number, target: IPoint, offsetX = 0, offsetY = 0): IGold | null {
    const canvas = Math.random() > .5 ? goldCanvas : goldCanvas2;
    const gold: IGold = {active: false, arrived: false, pos: {x:0,y:0}, center: {x:0,y:0}, size: {x:0,y:0}, radius: 0, angle: 0, update: updateIndividualGold, numOccupiedCells: 0, occupiedCells: [], vertices: [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}], index:0, target: null, offset: {x:0,y:0}, updateDelay: -1, updateable: false, drawable: false, arrivalCallback: () => {}, pixelCanvas: canvas};
    gold.active = true;
    updatePos(x, y, gold);
    gold.target = target;
    gold.offset.x = offsetX;
    gold.offset.y = offsetY;
    gold.updateDelay = -1;

    return gold;
}
PointPool.initialize(5000);
