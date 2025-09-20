import {IGridCell, IPoint, IPositionable} from "./interfaces";
import Grid from "./grid";
import {
    clamp, distance,
    getCos,
    getSin,
    normalizeAndScaleVector, normalizeVector, scaleVector,
} from "./math";
import {PointPool} from "./pools";
import {drawPixels, updatePos} from "./game_objects";
import {GLOBAL, PIXEL_SIZE} from "./constants";

// const ENEMY_MOVING_SPEED = 1.5;
const ENEMY_SEPARATION_FORCE = .9;

const PIXELS = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const PIXELS_COLOR_MAP = [null, "#fff", "#000"];

const FRINGE_AMPLITUDE = PIXEL_SIZE;  // Height of wave
const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d");
const characterWidth = PIXELS[0].length * PIXEL_SIZE
const characterHeight = PIXELS.length * PIXEL_SIZE + FRINGE_AMPLITUDE * 2;
offscreenCanvas.width = characterWidth;
offscreenCanvas.height = characterHeight;

const spriteSheetCanvas = document.createElement("canvas");
const NUM_FRAMES = 120;
createSpriteSheet({x: characterWidth, y: characterHeight})
const MOVING_SPEEDS = [1.75, 1.5, 1];
const SIZES = [8,16,32];
export const GHOST_DAMAGES = [25, 20, 10];
export const PLAYER_DAMAGES = [1,2,5];

export default class Ghost implements IPositionable {
    size: IPoint = {x: SIZES[0] * PIXEL_SIZE, y: SIZES[0] * PIXEL_SIZE};
    index: number = 0;
    grid: Grid | null;
    player: IPositionable | null;
    neighborGridCells: IGridCell[];
    neighborEnemies: Ghost[] = [];
    rotorRandomOffsets: number[] = [];
    sign: number = 1;
    pos: IPoint = {x: 0, y: 0};
    center: IPoint = {x: 0, y: 0};
    vel: IPoint = {x: 0, y: 0};
    angle: number = 0;
    occupiedCells: IGridCell[] = new Array(2000).fill(null);
    numOccupiedCells: number = 0;
    vertices: IPoint[] = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
    forwardDirection: boolean = true;
    frameCounter: number = 0;
    randomStart: number = 0;
    active: boolean = true;
    radius: number = SIZES[0] * PIXEL_SIZE/2;
    lastDamagedTime: number = 0;
    lastFlashedTime: number = 0;
    hitWaitTime: number = .25;
    life: number = 100;
    visible: boolean = true;
    sizes: IPoint[] = [
        { x: SIZES[0] * PIXEL_SIZE, y: SIZES[0] * PIXEL_SIZE },
        { x: SIZES[1] * PIXEL_SIZE, y: SIZES[1] * PIXEL_SIZE },
        { x: SIZES[2] * PIXEL_SIZE, y: SIZES[2] * PIXEL_SIZE }];
    currentSizeIndex = 0;

    constructor(pos: IPoint = {x: 0, y: 0}, grid: Grid = null, player: IPositionable = null) {
        this.grid = grid;
        updatePos(pos.x, pos.y, this);
        this.player = player;
        this.neighborEnemies = new Array(25).fill(null);
        this.neighborGridCells = new Array(4).fill(null);
        const rand = Math.random() * 100;
        const cos = getCos(rand);
        const sin = getSin(rand);
        this.vel.x = cos * MOVING_SPEEDS[this.currentSizeIndex];
        this.vel.y = sin * MOVING_SPEEDS[this.currentSizeIndex];
        this.rotorRandomOffsets = new Array(4).fill(0).map(() => Math.random() * Math.PI * 2);
        this.sign = Math.random() > .5 ? 1 : -1;
        drawPixels(offscreenCtx, PIXELS, PIXELS_COLOR_MAP, PIXEL_SIZE);
        this.frameCounter = Math.floor(Math.random() * NUM_FRAMES);
        this.randomStart = Math.random() * 2 * Math.PI;
        updatePos(pos.x, pos.y, this);
    }

    deactivate() {
        this.active = false;
    }

    activate() {
        this.active = true;
        this.life = 100;
        this.size = this.sizes[0];
        this.radius = this.size.x/2;
    }

    setSizeType(index:number) {
        this.currentSizeIndex = index;
        this.size = this.sizes[index];
        this.radius = this.size.x/2;
    }

    recoil(x: number, y:number) {
        const normalized = PointPool.get(x,y);
        normalizeVector(normalized, normalized);
        scaleVector(normalized, 2, normalized);
        this.vel.x = normalized.x;
        this.vel.y = normalized.y;
        PointPool.release(normalized);
    }

    draw(ctx: CanvasRenderingContext2D, scale: number = 1, t: number) {
        if (!this.active) return;

        // flash when hit
        const readyToFlash = GLOBAL.time - this.lastFlashedTime > this.hitWaitTime/10;
        const wasHitRecently = this.lastDamagedTime && (GLOBAL.time - this.lastDamagedTime < this.hitWaitTime);
        if (wasHitRecently && readyToFlash) {
            this.lastFlashedTime = GLOBAL.time;
            this.visible = !this.visible;
        } else {
            this.visible = true;
        }

        ctx.save();
        if (!this.visible) ctx.globalAlpha = .5;
        ctx.translate(this.center.x * scale, this.center.y * scale);
        ctx.rotate(this.angle);
        ctx.imageSmoothingEnabled = false;

        const sx = this.frameCounter * this.sizes[0].x; // source x on sprite sheet
        ctx.drawImage(spriteSheetCanvas,
            sx,
            0,
            this.sizes[0].x,
            this.sizes[0].y + FRINGE_AMPLITUDE,
            -this.size.x / 2 * scale,
            -this.size.y / 2 * scale,
            this.size.x * scale,
            (this.size.y + FRINGE_AMPLITUDE) * scale
        );

        ctx.globalAlpha = 1;
        ctx.restore();


        if (this.forwardDirection) {
            this.frameCounter++;
            if (this.frameCounter >= NUM_FRAMES - 1) {
                this.forwardDirection = false;
            }
        } else {
            this.frameCounter--;
            if (this.frameCounter <= 0) {
                this.forwardDirection = true;
            }
        }
    }

    update(t: number) {
        if (!this.grid || !this.player || !this.active) return;

        const dirToPlayer = PointPool.get();
        const separation = PointPool.get();
        normalizeVector({x: this.player.center.x - this.center.x, y: this.player.center.y - this.center.y}, dirToPlayer);

        this.grid.getNeighborEnemies(this.pos, this.neighborEnemies);
        const SEPARATION_DISTANCE = 50;

        // Calculate separation force
        const max = Math.min(this.neighborEnemies.length, 10);
        for (let i = 0; i < max; i++) {
            const enemy = this.neighborEnemies[i];
            if (enemy === this) continue;  // Don't consider itself
            if (!enemy) break;  // Reached the end of the neighbors

            const dx = this.center.x - enemy.center.x;
            const dy = this.center.y - enemy.center.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < Number.EPSILON) continue;  // Skip if the enemy is on top of this enemy

            if (distance < SEPARATION_DISTANCE) {  // SEPARATION_DISTANCE could be, e.g., 20 units
                const force = (SEPARATION_DISTANCE - distance) / SEPARATION_DISTANCE;
                separation.x += force * dx / distance;
                separation.y += force * dy / distance;
            }
        }

        normalizeAndScaleVector(separation, ENEMY_SEPARATION_FORCE, separation);

        // Combine player attraction and separation forces
        dirToPlayer.x += separation.x;
        dirToPlayer.y += separation.y;

        const distanceToPlayer = distance(this.center, this.player.center);

        if (distanceToPlayer < 200) {
            const DECAY = 0.05;
            if (Math.sign(this.vel.x) !== Math.sign(dirToPlayer.x)) {
                this.vel.x = this.vel.x + Math.sign(dirToPlayer.x) * DECAY;
            } else {
                this.vel.x = dirToPlayer.x * MOVING_SPEEDS[this.currentSizeIndex];
            }

            if (Math.sign(this.vel.y) !== Math.sign(dirToPlayer.y)) {
                this.vel.y = this.vel.y + Math.sign(dirToPlayer.y) * DECAY
            } else {
                this.vel.y = dirToPlayer.y * MOVING_SPEEDS[this.currentSizeIndex];
            }
        } else {
            // move sinusoidally and a little bit towards the player
            const t = GLOBAL.time *1000;
            const cos = getCos(t / 1000 + this.randomStart)/2;
            const sin = getSin(t / 1000 + this.randomStart)/2;
            this.vel.x = cos * MOVING_SPEEDS[this.currentSizeIndex];
            this.vel.y = sin * MOVING_SPEEDS[this.currentSizeIndex];
            // move slightly towards the player
            this.vel.x += dirToPlayer.x * MOVING_SPEEDS[this.currentSizeIndex]/2;
            this.vel.y += dirToPlayer.y * MOVING_SPEEDS[this.currentSizeIndex]/2;

        }

        const x = clamp(this.pos.x + this.vel.x, 0, this.grid.gameSize.x - this.size.x);
        const y = clamp(this.pos.y + this.vel.y, 0, this.grid.gameSize.y - this.size.y);
        updatePos(x, y, this);

        PointPool.release(dirToPlayer);
        PointPool.release(separation);
    }
}

function createSpriteSheet(size: IPoint) {
    spriteSheetCanvas.width = size.x * NUM_FRAMES;
    spriteSheetCanvas.height = size.y + FRINGE_AMPLITUDE;
    const spriteSheetCtx = spriteSheetCanvas.getContext('2d');

    for (let frame = 0; frame < NUM_FRAMES; frame++) {
        const t = frame / 60 * 1000; // convert frame number to time (assuming 60fps)

        // Render the ghost's body
        const xOffset = frame * size.x;
        drawPixels(spriteSheetCtx, PIXELS, PIXELS_COLOR_MAP, PIXEL_SIZE, xOffset);

        // Render the ghost's fringe
        const yBase = 7 * PIXEL_SIZE;
        const numWaves = 7;
        const frequency = (2 * Math.PI) / (size.x / numWaves);
        for (let x = 0; x < size.x; x += PIXEL_SIZE) {
            const sin = getSin(frequency * (x / PIXEL_SIZE) + (t / 100));
            const yOffset = FRINGE_AMPLITUDE * sin
            const h = FRINGE_AMPLITUDE + yOffset;
            spriteSheetCtx.fillStyle = PIXELS_COLOR_MAP[1];
            spriteSheetCtx.fillRect(frame * size.x + x, yBase, PIXEL_SIZE, h);
        }

        // Render the ghost's mouth
        const mouthSize = PIXEL_SIZE * 2 * (1 - Math.abs((t % 2000) - 1000) / 1000);
        const sin = getSin(t / 100);
        const cos = getCos(t / 100);
        const mouthX = PIXEL_SIZE * 4 + sin;
        const mouthY = PIXEL_SIZE * 5 + cos;
        spriteSheetCtx.fillStyle = "#000";
        spriteSheetCtx.fillRect(frame * size.x + (mouthX - mouthSize / 2), (mouthY - mouthSize / 2), mouthSize, mouthSize);
    }

    return spriteSheetCanvas;
}