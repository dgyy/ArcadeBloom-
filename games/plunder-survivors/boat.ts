import {ICircle, IGold, IGridCell, IPoint, IPositionable, ISpeedable, IUpgrade, IVehicleInputState} from "./interfaces";
import Grid from "./grid";
import {clamp, dot, getCos, getSin, normalizeVector, subtractVectors} from "./math";
import {drawPixels, updatePos} from "./game_objects";
import {GLOBAL, PIXEL_SIZE} from "./constants";
import {BulletPool} from "./pools";
import { playCannonSound} from "./sound";

const TURNING_SPEED_THRESHOLD = 0.1;
const VEL_BOOST_ROAD = .25;
const MAX_CELLS = 100;

const PIXELS = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 1, 1, 2, 2, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [1, 1, 2, 2, 2, 2, 1, 0],
    [1, 1, 2, 2, 2, 2, 1, 1],
    [1, 2, 2, 3, 3, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 3, 3, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
];

const PIXELS_COLOR_MAP = [null, "#663931", "#8f563b", "#fff"];

const boatCanvas = document.createElement("canvas");
const boatCtx = boatCanvas.getContext("2d");
const boatWidth = PIXELS[0].length * PIXEL_SIZE
const boatHeight = PIXELS.length * PIXEL_SIZE
boatCanvas.width = boatWidth;
boatCanvas.height = boatHeight;
const BASE_MAX_SPEED = 2;
export default class Boat implements IPositionable, ICircle, ISpeedable {
    inputState: IVehicleInputState;
    grid: Grid;
    turnSpeed: number = .05;
    movingBackwards: boolean = false;
    acc: IPoint = {x: 0, y: 0};
    radius: number = 10
    center: IPoint = {x: 0, y: 0};
    front: IPoint = {x: 0, y: 0};
    pos: IPoint = {x: 0, y: 0};
    vel: IPoint = {x: 0, y: 0};
    angle: number = 0;
    size: IPoint = {x: boatWidth, y: boatHeight };
    color: string = "red";
    occupiedCells: IGridCell[] = new Array(2000).fill(null);
    numOccupiedCells: number = 0;
    vertices: IPoint[] = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x:0, y: 0}];
    direction: IPoint = {x: 1, y: 0};
    life: number = 100;
    active: boolean = true;
    gold: IGold[] = [];
    upgrades: IUpgrade[];

    currentTime: number = 0;
    bulletDirection: IPoint = {x: 0, y: 0};
    bulletSpeed: number = 3;
    index: number = 0;

    // Upgrades
    gunSpeed: number = .25;
    regularGunLastFiredTimes: number[] = [];
    targetGunLastFiredTimes: number[] = [0];

    speedUpgrade: number = 0;
    armorUpgrade: number = 1;

    visible: boolean = true;
    lastDamagedTime: number = 0;
    lastFlashedTime: number = 0;
    hitWaitTime: number = .25;

    constructor(grid: Grid, inputState: IVehicleInputState, upgrades: IUpgrade[]) {
        this.inputState = inputState;
        this.color = "#b465c7"
        const widthHalf = this.size.x / 2;
        const heightHalf = this.size.y / 2;
        const radius = Math.sqrt(widthHalf * widthHalf + heightHalf * heightHalf);
        this.radius = radius;
        this.grid = grid;
        this.occupiedCells = new Array(MAX_CELLS).fill(null);
        this.upgrades = upgrades;

        updatePos(grid.gameSize.x / 2, grid.gameSize.y / 2, this);
        drawPixels(boatCtx, PIXELS, PIXELS_COLOR_MAP, PIXEL_SIZE);
    }

    get speed(): number {
        return Math.hypot(this.vel.x, this.vel.y);
    }

    get maxSpeed(): number {
        return BASE_MAX_SPEED + this.speedUpgrade;
    }
    turnKeyboard() {
        if (Math.abs(this.speed) < TURNING_SPEED_THRESHOLD) return;
        let sign = Math.sign(this.inputState.pos.x);
        if (this.movingBackwards) {
            sign = -sign
        }

        this.angle += this.turnSpeed * Math.abs(this.speed/this.maxSpeed) * sign % (Math.PI * 2);
    }

    turnJoyStick() {
        let magnitude = Math.hypot(this.inputState.pos.x, this.inputState.pos.y);

        if (magnitude > 0) {
            this.angle = Math.atan2(-this.inputState.pos.y, this.inputState.pos.x) + Math.PI/2;
        }
    }

    updateVel() {
        let direction = Math.hypot(this.inputState.pos.x, this.inputState.pos.y); // JS magnitude
        if (this.inputState.mode === "kb") direction = Math.sign(this.inputState.pos.y); // Keyboard magnitude

        const cos = getCos(this.angle - Math.PI/2);
        const sin = getSin(this.angle - Math.PI/2);
        this.acc.x = cos * direction * (VEL_BOOST_ROAD + this.speedUpgrade);
        this.acc.y = sin * direction * (VEL_BOOST_ROAD + this.speedUpgrade);

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        // Limit the speed to the maximum speed
        const speed = Math.hypot(this.vel.x, this.vel.y);
        if (speed > this.maxSpeed) {
            const scaleFactor = this.maxSpeed / speed;
            this.vel.x *= scaleFactor;
            this.vel.y *= scaleFactor;
        }

        // Apply damping to gradually slow down the velocity
        const FRICTION = .95;
        this.vel.x *= FRICTION;
        this.vel.y *= FRICTION;

        this.movingBackwards = this.inputState.mode === "kb" && this.inputState.pos.y < 0;
        this.direction.x = getCos(this.angle - Math.PI/2);
        this.direction.y = getSin(this.angle - Math.PI/2);
    }

    update(t: number): void {
        this.currentTime += t;

        if (this.inputState.mode === "js") {
            this.turnJoyStick();
        } else {
            this.turnKeyboard();
        }

        this.updateVel();

        // update player pos but mind the edges of the canvas
        const x = clamp(this.pos.x + this.vel.x, 0, this.grid.gameSize.x - this.size.x);
        const y = clamp(this.pos.y + this.vel.y, 0, this.grid.gameSize.y - this.size.y);
        updatePos(x, y, this);

        const frontOffset = this.size.y / 4; // Halfway between the middle and the front
        this.front.x = this.center.x + this.direction.x * frontOffset;
        this.front.y = this.center.y + this.direction.y * frontOffset;

        // make the gold all be at the same angle as the boat
        for (let i = 0; i < this.gold.length; i++) {
            this.gold[i].angle = this.angle;
        }

        const enemies = this.grid.getNearestEnemy(this.center, this.targetGunLastFiredTimes.length);
        for (let i = 0; i < enemies.length; i++) {
            if (this.currentTime - this.targetGunLastFiredTimes[i] < this.gunSpeed) continue;
            const enemy = enemies[i];
            this.targetGunLastFiredTimes[i] = this.currentTime;
            normalizeVector(subtractVectors(enemy.center, this.center, this.bulletDirection), this.bulletDirection);
            normalizeVector(this.bulletDirection, this.bulletDirection); // Re-normalize after adjustments
            const dotProduct = dot(this.bulletDirection, this.direction);
            shootGun(this.center, this.bulletDirection, this.bulletSpeed + this.speed * dotProduct);
        }

        const angleIncrement = 2 * Math.PI / this.regularGunLastFiredTimes.length;
        for (let i = 0; i < this.regularGunLastFiredTimes.length; i++) {
            if (this.currentTime - this.regularGunLastFiredTimes[i] < this.gunSpeed) continue;
            this.regularGunLastFiredTimes[i] = this.currentTime;
            const angle = this.angle + angleIncrement * i;
            const direction = {x: getCos(angle), y: getSin(angle)};
            shootGun(this.center, direction, this.bulletSpeed + this.speed);
        }

        // if (this.forwardGun && (this.currentTime - this.forwardGunLastFiredTime) > this.forwardGunSpeed) {
        //     this.forwardGunLastFiredTime = this.currentTime;
        //     shootGun(this.center, this.direction, this.bulletSpeed + this.speed);
        // }

        // if (this.spreadGun && (this.currentTime - this.spreadGunLastFiredTime) > this.spreadGunSpeed) {
        //     this.spreadGunLastFiredTime = this.currentTime;
        //     const angleIncrement = 2 * Math.PI / this.spreadGunNumberOfBullets;
        //     for (let i = 0; i < this.spreadGunNumberOfBullets; i++) {
        //         const angle = this.angle + angleIncrement * i;
        //         const direction = {x: getCos(angle), y: getSin(angle)};
        //         shootGun(this.center, direction, this.bulletSpeed + this.speed);
        //     }
        // }

    }

    draw(ctx: CanvasRenderingContext2D, scale:number = 1): void {
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
        ctx.imageSmoothingEnabled = false;  // Ensure no smoothing for main canvas
        ctx.drawImage(boatCanvas, 0, 0, this.size.x, this.size.y, -this.size.x/2*scale, -this.size.y/2*scale, this.size.x * scale, this.size.y * scale);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

function shootGun(pos: IPoint, direction: IPoint, speed: number = 1.5) {
    const bullet = BulletPool.get(pos.x, pos.y);
    bullet.vel.x = direction.x * speed;
    bullet.vel.y = direction.y * speed;
    playCannonSound();
    return bullet;
}