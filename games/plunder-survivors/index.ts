import {Joystick} from "./joystick";
import {KeyboardInput} from "./keyboard_input";
import {
    calculateAngle, distance,
    getCos, getSin,
    normalizeVector,
    randomFloat,
    vectorFromEdge
} from "./math";
import {circlesCollide, findCollisions} from "./collision";
import {
    IPoint,
    IVehicleInputState,
    ICollision, CanvasColor, IRegion, IGold, IUpgrade, IBounds,
} from "./interfaces";
import {
    roadsAndRegionsFromPoints,
} from "./level_generation";
import Grid, {GAME_WIDTH} from "./grid";
import Ghost, {GHOST_DAMAGES, PLAYER_DAMAGES} from "./ghost";

import Road, {ROAD_WIDTH} from "./road";
import Camera from "./camera";
import {BulletPool, createGold, GOLD_PIXELS, PointPool} from "./pools";
import Boat from "./boat";
import {updatePos} from "./game_objects";
import {GLOBAL, PIXEL_SIZE} from "./constants";
import {
    createAudioContext,
    playCannonballHitEnemySound,
    playCoinPickupSound, playEnemyDeathSound,
    playFanfareSound,
    playHitPlayerSound, playSadFanfareSound
} from "./sound";

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const grid = new Grid();
const upgradeMenu: HTMLElement = document.querySelector("#um");
const restartMenu: HTMLElement = document.querySelector("#rm");
const startMenu: HTMLElement = document.querySelector("#sm");
const amountGoldElement: HTMLElement = document.querySelector("#gp");
const surviveElement: HTMLElement = document.querySelector("#survive");
const upgradeGoldRemainingElement: HTMLElement = document.querySelector("#ugr");
const tryAgainElement = document.querySelector("#ta");
const timeRemainingElement = document.querySelector("#tr");
const waveTimeElement = document.querySelector("#wt");
const upgradeButton: HTMLButtonElement = document.querySelector("#aub");
const upgradeTable: HTMLTableElement = document.querySelector("#menu-table");
const amountRumElement: HTMLTableElement = document.querySelector("#amount-rum");
const ghostsPoppedElement: HTMLTableElement = document.querySelector("#po");
const endGoldRemainingElement: HTMLTableElement = document.querySelector("#egr");
const waveNumberElement: HTMLElement = document.querySelector("#wn");

canvas.id = "g";
canvas.width = 1000
canvas.height = 1000;
const GRID_SCALE = 1 / 2;

const camera = new Camera({x: 0, y: 0}, 1.25, 1, {x: canvas.width, y: canvas.height}, grid.gameSize, GRID_SCALE);

const NUM_POINTS = 100;
const MAX_ENEMIES = 5000;
const MAX_POINT_TRIES = 10;
const MIN_POINT_DIST = ROAD_WIDTH * 2;
const MAX_DIMENSION = 1000;
const FIXED_TIMESTEP = 1 / 60;  // fixed timestep of 60 FPS
let accumulator = 0;  // accumulates elapsed time
let lastTime = performance.now();
const regionCollisions: ICollision[] = []
let numRegionCollisions = 0;
const neighborEnemies: Ghost[] = new Array(100).fill(null);
let numRum = 0;
const MAX_TIME = 5 * 60;
let started = false;
let waveNumber = 1;
let regionNumber = 1;
let numGhostsPopped = 0;
const MAX_WAVES = 10;
const WAVE_NUMBER_ENEMIES = [10, 50, 100, 200, 300, 400, 500, 600, 700, 800];
const WAVE_PERCENT_CHANCE_BIG_GHOST = [.01, .05, .01, .1, .1, .1, .1, .15, .2, .2];
const WAVE_PERCENT_CHANCE_HUGE_GHOST = [0, .001, .001, .001, .001, .001, .001, .0025, .005, .01];
const MAX_GOLD_PER_REGION = 7;
const WAVE_TIMES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
GLOBAL.time = 0;
GLOBAL.timeLeft = MAX_TIME;
GLOBAL.nextWaveInTime = WAVE_TIMES[1];

for (let i = 0; i < 25; i++) {
    regionCollisions[i] = {edge: {v0: {x: 0, y: 0}, v1: {x: 0, y: 0}}, depth: 0};
}

const div = document.createElement("div");
div.appendChild(canvas);
document.body.prepend(canvas);

const roadCanvas = document.createElement('canvas');
const roadsCtx = roadCanvas.getContext('2d');
const regionsCanvas = document.createElement('canvas');
const regionsCtx = regionsCanvas.getContext('2d');
const offscreenCanvas: HTMLCanvasElement = document.createElement("canvas");
const offscreenBufferCtx: CanvasRenderingContext2D = offscreenCanvas.getContext("2d");
roadCanvas.width = grid.gameSize.x * GRID_SCALE;
roadCanvas.height = grid.gameSize.y * GRID_SCALE;
regionsCanvas.width = grid.gameSize.x * GRID_SCALE;
regionsCanvas.height = grid.gameSize.y * GRID_SCALE;
offscreenCanvas.width = grid.gameSize.x;
offscreenCanvas.height = grid.gameSize.y;

BulletPool.gameSize = grid.gameSize;
BulletPool.grid = grid;
BulletPool.initialize(5000);

const joystick = new Joystick(canvas, joystickMoveCallback);
const keyboard = new KeyboardInput(window, keyCallback);
const playerInputState: IVehicleInputState = {pos: {x: 0, y: 0}, mode: "kb"};
let points: IPoint[] = [];
let ghosts: Ghost[] = [];
const allGold: IGold[] = [];
let goldRemaining = 0;
let previousXMarkRegionIndices: number[] = [];
let selectedUpgrades: string[] = [];
let desiredXMarkDistance = 0;
const MAX_X_MARK_DISTANCE = GAME_WIDTH / 2;
const UI_STATE = {
    upgradeMenuVisible: false,
    restartMenuVisible: false,
    transferringCoins: false,
}

for (let i = 0; i < NUM_POINTS; i++) {
    let tries = 0;
    while (tries < MAX_POINT_TRIES) {
        const p = randomPointWithinBounds(grid.gameSize);
        let tooClose = false;
        for (const point of points) {
            if (distance(p, point) < MIN_POINT_DIST) {
                tooClose = true;
                break;
            }
        }
        if (tooClose) {
            const newPoint = randomPointWithinBounds(grid.gameSize);
            p.x = newPoint.x;
            p.y = newPoint.y;
            tries++;
        } else {
            points.push(p);
            break;
        }
    }
}

function randomPointWithinBounds(bounds: IPoint): IPoint {
    return {
        x: randomFloat(0, bounds.x),
        y: randomFloat(0, bounds.y)
    };
}

let {roads, regions} = roadsAndRegionsFromPoints(points, grid.gameSize);
const randomRoad = findRoadCenterClosestToCenterOfGame();

let upgrades: IUpgrade[] = [
    { name: "Questionable Rum", currentLevel: 0, maxLevel: 99, cost: 0 },
    { name: "50% Damage Recovery", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Speed Sails", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Armor", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Add 2 Cannons", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Add 1 Target Cannon", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Add Treasure Stop", currentLevel: 0, maxLevel: 5, cost: 2 },
    { name: "Cannonball Speed Up", currentLevel: 0, maxLevel: 5, cost: 2 },
];

const depotIndex = Math.floor(regions.length/2);
let xMarkIndices: number [] = [];
const DROP_OFF_RADIUS = ROAD_WIDTH / 2;
let circleSize = DROP_OFF_RADIUS * .9 * GRID_SCALE; // Starting size
let sizeDirection = 1; // 1 for increasing, -1 for decreasing
const SIZE_SPEED = 0.25 * GRID_SCALE; // Adjust this to make the pulse faster or slower
const SIZE_MAX = DROP_OFF_RADIUS * .9 * GRID_SCALE; // Maximum size value
const SIZE_MIN = DROP_OFF_RADIUS * .6 * GRID_SCALE; // Minimum size value

const regionVertices = regions.map(r => r.vertices);

const player = new Boat(grid, playerInputState, upgrades);
grid.setRoads(roads);
GLOBAL.player = player;

const depot: IRegion = regions[depotIndex];
depot.type = "depot";

updatePos(depot.dropOffPoint.x, depot.dropOffPoint.y, player);
camera.centerOn(player);
player.angle = randomRoad.angle + Math.PI / 2;

// Generate enemies
for (let i = 0; i < MAX_ENEMIES; i++) {
    const pos = generateRandomPositionOutsideView(camera.viewableBounds, grid.gameSize);
    const ghost = new Ghost({x: pos.x, y: pos.y }, grid, player);
    ghost.active = false;
    ghosts.push(ghost);
}
function activateEnemies(num: number) {
    let i = 0;

    while (i < num && i < ghosts.length) {
        const enemy = ghosts[i];
        if (!enemy.active) {
            enemy.activate();
            // set the enemy size type based on percent chance for the wave
            const rand = Math.random();
            if (rand < WAVE_PERCENT_CHANCE_HUGE_GHOST[waveNumber-1]) {
                enemy.setSizeType(2);
            } else if (rand < WAVE_PERCENT_CHANCE_BIG_GHOST[waveNumber-1]) {
                enemy.setSizeType(1);
            } else {
                enemy.setSizeType(0);
            }

            const pos = generateRandomPositionOutsideView(camera.viewableBounds, grid.gameSize);
            updatePos(pos.x, pos.y, enemy);
        }

        i++;
    }
}

function generateRandomPositionOutsideView(viewableBounds: IBounds , worldSize: IPoint): IPoint {
    let x: number, y: number;
    let inView = false;
    let inWorld = false;

    let i = 0;

    do {
        const angle = Math.random() * Math.PI * 2;
        const center = {
            x: (viewableBounds.bottomRight.x - viewableBounds.topLeft.x) / 2 + viewableBounds.topLeft.x,
            y: (viewableBounds.bottomRight.y - viewableBounds.topLeft.y) / 2 + viewableBounds.topLeft.y
        };
        const radius = Math.hypot(
            Math.abs(viewableBounds.topLeft.x - center.x),
            Math.abs(viewableBounds.topLeft.y - center.y)
        ) + Math.random() * ROAD_WIDTH/2;  // I added a random additional radius here to ensure the point is well outside the view

        x = center.x + radius * Math.cos(angle);
        y = center.y + radius * Math.sin(angle);

        inView = x > viewableBounds.topLeft.x && x < viewableBounds.bottomRight.x && y > viewableBounds.topLeft.y && y < viewableBounds.bottomRight.y;
        inWorld = x >= 0 && y >= 0 && x <= worldSize.x && y <= worldSize.y;

        i++;
        if (i > 100) {
            console.log("no");
            break;
        }
    } while (inView || !inWorld);

    return { x, y };
}

function generateXMarkRegionIndexDistanceOrMoreAwayFromDepot(desiredDistance: number): void {

    const stopsUpgrade = upgrades.find(u => u.name === "Add Treasure Stop");

    for (let i = 0; i < stopsUpgrade.currentLevel + 1; i++) {
        let minIndex = null;

        for (let j = 0; j < regions.length; j++) {
            // continue if the region is too close to the depot dropoff point
            if (regions[j].type !== "empty") continue;
            if (xMarkIndices.includes(j)) continue;
            if (circlesCollide(regions[j].dropOffPoint.x, regions[j].dropOffPoint.y, DROP_OFF_RADIUS, depot.dropOffPoint.x, depot.dropOffPoint.y, DROP_OFF_RADIUS)) {
                continue;
            }
            if (distance(regions[j].dropOffPoint, depot.dropOffPoint) < desiredDistance) continue;

            // set minIndex to the current index if it's closer to the depot dropoff point than the current minIndex
            if (minIndex === null || distance(regions[j].dropOffPoint, depot.dropOffPoint) < distance(regions[minIndex].dropOffPoint, depot.dropOffPoint)) {
                minIndex = j;
            }
        }

        const region = regions[minIndex];
        region.type = "x-mark";

        const goldAmount = getGoldAmountForRegionNumber(regionNumber);
        for (let i = 0; i < goldAmount; i++) {
            const gold = createGold(region.center.x, region.center.y, depot.center);
            gold.arrivalCallback = goldArrivedAtBoat;
            gold.arrived = false;
            region.gold.push(gold);
            allGold.push(gold);
        }

        xMarkIndices.push(minIndex);
    }


    regionNumber++;
}

function getGoldAmountForRegionNumber(number: number): number {
    return Math.max(Math.floor(Math.random() * MAX_GOLD_PER_REGION) + 1,2);
}

function findRoadCenterClosestToCenterOfGame(): Road {
    let minDist = Number.MAX_VALUE;
    let closestRoad = null;
    for (const road of roads) {
        const dist = distance(road.center, {x: GAME_WIDTH / 2, y: GAME_WIDTH / 2});
        if (dist < minDist) {
            minDist = dist;
            closestRoad = road;
        }
    }
    return closestRoad;
}

function tick(t: number) {
    let deltaTime = (t - lastTime) / 1000;  // convert to seconds
    lastTime = t;

    // prevent spiral of death (when the frame rate drops below the fixed timestep)
    deltaTime = Math.min(deltaTime, FIXED_TIMESTEP * 5);

    lastTime = t;

    accumulator += deltaTime;

    while (accumulator >= FIXED_TIMESTEP) {
        update(FIXED_TIMESTEP);
        accumulator -= FIXED_TIMESTEP;
    }
    draw(t)

    requestAnimationFrame(tick);

}

function update(t: number) {
    GLOBAL.absoluteTime += t;
    updateAllGold(t);

    if (!started) return;
    if (UI_STATE.transferringCoins) return;
    if (UI_STATE.upgradeMenuVisible) return;
    if (UI_STATE.restartMenuVisible) return;

    GLOBAL.time +=t;
    GLOBAL.timeLeft = Math.max(MAX_TIME - GLOBAL.time, 0);
    let nextWaveInTime = 0
    if (waveNumber < MAX_WAVES) nextWaveInTime = WAVE_TIMES[waveNumber] - GLOBAL.time;

    GLOBAL.nextWaveInTime = Math.max(nextWaveInTime, 0);

    if (nextWaveInTime <= 0 && waveNumber < MAX_WAVES) {
        waveNumber++;
        setTimeout(showWaveNumber, 500);
        activateEnemies(numEnemiesForWave(waveNumber));
    }

    if (GLOBAL.timeLeft <= 0) {
        showRestartMenu();
        return;
    }

    grid.clearEnemyMap();

    for (let i = 0; i < ghosts.length; i++) {
        const enemy = ghosts[i];
        if (!enemy || !enemy.active) continue;
        grid.addToEnemyMap(enemy);
    }

    for (let i = 0; i < ghosts.length; i++) {
        const enemy = ghosts[i];
        if (!enemy || !enemy.active) continue;
        enemy.update(t);
    }

    if (player.active) player.update(t);
    BulletPool.update(t);

    handleBulletsCollidingWithEnemies();
    handleEnemiesCollidingWithPlayer();

    numRegionCollisions = findCollisions(player.vertices, regionVertices, regionCollisions);

    handleWallCollisions();
    handleCollectingGold();
    camera.centerOn(player);
    updateScreenShake(t);
}

function handleWallCollisions() {
    for (let i = 0; i < numRegionCollisions; i++) {
        const collision = regionCollisions[i];

        const collisionEdge = collision.edge;
        const normalizedCollisionEdge = PointPool.get();
        vectorFromEdge(collisionEdge, normalizedCollisionEdge);
        normalizeVector(normalizedCollisionEdge, normalizedCollisionEdge);

        const penetrationDepth = collision.depth;
        player.pos.x -= normalizedCollisionEdge.x * penetrationDepth;
        player.pos.y -= normalizedCollisionEdge.y * penetrationDepth;

        PointPool.release(normalizedCollisionEdge);
    }
}
function updateScreenShake(t: number) {
    if (camera.screenShake.active) {
        camera.screenShake.elapsed += t;

        if (camera.screenShake.elapsed >= camera.screenShake.duration) {
            camera.screenShake.active = false;
            camera.resetOffset(); // Reset any camera offset caused by the shake.
        } else {
            const x = (Math.random() - 0.5) * 2 * camera.screenShake.magnitude;
            const y = (Math.random() - 0.5) * 2 * camera.screenShake.magnitude;
            camera.setOffset(x, y);
        }
    }
}

function handleEnemiesCollidingWithPlayer() {
    for (let i = 0; i < ghosts.length; i++) {
        const enemy = ghosts[i];
        if (!enemy || !enemy.active) continue;
        // continue if enemy last hit player within wait time
        if (player.lastDamagedTime && (GLOBAL.time - player.lastDamagedTime) < player.hitWaitTime) continue;
        if (circlesCollide(player.center.x, player.center.y, player.radius, enemy.center.x, enemy.center.y, enemy.radius)) {
            player.life -= PLAYER_DAMAGES[enemy.currentSizeIndex] * player.armorUpgrade;
            player.lastDamagedTime = GLOBAL.time;
            playHitPlayerSound();

            for (let i = 0; i < 10; i++) {
                const b = BulletPool.get(player.center.x + randomFloat(-player.size.x/2, player.size.x/2), player.center.y + randomFloat(-player.size.y/2,player.size.y/2));
                b.makeParticle();
                b.color = "#663931";
            }

            if (player.life <= 0 && player.active) {
                player.life = 0;
                player.active = false;
                playSadFanfareSound();

                for (let i = 0; i < 100; i++) {
                    const b = BulletPool.get(player.center.x + randomFloat(-player.size.x/2, player.size.x/2), player.center.y + randomFloat(-player.size.y/2,player.size.y/2));
                    b.makeParticle();
                    b.color = "#663931";
                }

                if (!UI_STATE.restartMenuVisible) {
                    setTimeout(() => {
                        showRestartMenu();
                    }, 1000);
                }
            }

            camera.screenShake.active = true;
            camera.screenShake.elapsed = 0;
            camera.screenShake.magnitude = 3;   // Adjust based on desired intensity
        }
    }
}

function handleBulletsCollidingWithEnemies() {
    for (let i = 0; i < BulletPool.available.length; i++) {
        const bullet = BulletPool.available[i];
        if (!bullet.active || bullet.type === "particle") continue;
        grid.getNeighborEnemies(bullet.pos, neighborEnemies);
        for (let j = 0; j < neighborEnemies.length; j++) {
            if (!neighborEnemies[j] || !neighborEnemies[j].active) continue;
            const enemy = neighborEnemies[j];
            if (circlesCollide(bullet.center.x, bullet.center.y, bullet.radius, enemy.center.x, enemy.center.y, enemy.radius)) {
                if (enemy.lastDamagedTime && (GLOBAL.time - enemy.lastDamagedTime) < enemy.hitWaitTime) continue;
                enemy.lastDamagedTime = GLOBAL.time;
                BulletPool.release(bullet);
                playCannonballHitEnemySound();
                enemy.life -= GHOST_DAMAGES[enemy.currentSizeIndex];
                enemy.recoil(bullet.vel.x, bullet.vel.y);
                for (let i = 0; i < 3; i++) {
                    const b = BulletPool.get(enemy.center.x + randomFloat(-enemy.size.x/2, enemy.size.x/2), enemy.center.y + randomFloat(-enemy.size.y/2,enemy.size.y/2));
                    b.makeParticle();
                    b.setSize(enemy.currentSizeIndex)
                }

                if (enemy.life <= 0) {
                    enemy.deactivate();
                    playEnemyDeathSound();
                    for (let i = 0; i < 20; i++) {
                        const b = BulletPool.get(enemy.center.x + randomFloat(-enemy.size.x/2, enemy.size.x/2), enemy.center.y + randomFloat(-enemy.size.y/2,enemy.size.y/2));
                        b.makeParticle();
                        b.setSize(enemy.currentSizeIndex)
                    }
                    numGhostsPopped++;
                }
                break;
            }
        }
    }
}

function handleCollectingGold() {
    if (xMarkIndices.length > 0) {
        previousXMarkRegionIndices.length = 0;
        for (let i = 0; i < xMarkIndices.length; i++) {
            const {x: x1, y: y1} = player.center;
            const {radius: r1} = player;
            const region = regions[xMarkIndices[i]];
            const {x: x2, y: y2} = region.dropOffPoint;
            const inDropOffRadius = circlesCollide(x1, y1, r1, x2, y2, DROP_OFF_RADIUS);

            if (inDropOffRadius && player.speed < 1) {
                previousXMarkRegionIndices.push(xMarkIndices[i]);
                // player.gold.length = 0;
                for (let i = 0; i < region.gold.length; i++) {
                    const gold = region.gold[i];
                    gold.updateable = true;
                    gold.drawable = true;
                    gold.target = player.front;
                    gold.updateDelay = (i % 10) * .1 + GLOBAL.absoluteTime;
                    const offsetX = randomFloat(-ROAD_WIDTH/4, ROAD_WIDTH/4);
                    const offsetY = randomFloat(-ROAD_WIDTH/4, ROAD_WIDTH/4);
                    updatePos(gold.pos.x + offsetX, gold.pos.y + offsetY, gold);

                    player.gold.push(gold);
                }

                UI_STATE.transferringCoins = true;
                region.gold.length = 0;
                region.type = "plundered";
            }
        }
        xMarkIndices = xMarkIndices.filter(i => previousXMarkRegionIndices.indexOf(i) === -1);
    } else {
        const {x: x1, y: y1} = player.center;
        const {radius: r1} = player;
        const {x: x2, y: y2} = regions[depotIndex].dropOffPoint;
        const inDropOffRadius = circlesCollide(x1, y1, r1, x2, y2, DROP_OFF_RADIUS);

        if (inDropOffRadius && player.speed < 1) {

            for (let i = 0; i < player.gold.length; i++) {
                const gold = player.gold[i];
                const offsetX = randomFloat(-ROAD_WIDTH/4, ROAD_WIDTH/4);
                const offsetY = randomFloat(-ROAD_WIDTH/4, ROAD_WIDTH/4);
                gold.target = depot.center;
                gold.offset.x = offsetX;
                gold.offset.y = offsetY;
                gold.arrived = false;
                gold.updateDelay = (i % 10) * .1 + GLOBAL.absoluteTime;
                gold.arrivalCallback = goldArrivedAtDepot;
                depot.gold.push(gold);
            }

            player.gold.length = 0;
            UI_STATE.transferringCoins = true;
        }
    }
}

function updateAllGold(t: number) {
    for (let i = 0; i < allGold.length; i++) {
        const gold = allGold[i];
        if (gold.active) gold.update(t);
    }
}
function drawAllGold(ctx: CanvasRenderingContext2D, scale: number = 1) {
    for (let i = 0; i < allGold.length; i++) {
        const gold = allGold[i];
        if (!gold.active) continue;
        if (!gold.drawable) continue;
        const height = GOLD_PIXELS.length * PIXEL_SIZE;
        const width = GOLD_PIXELS[0].length * PIXEL_SIZE;
        ctx.save();
        ctx.translate(gold.center.x * scale, gold.center.y * scale);
        ctx.rotate(gold.angle);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(gold.pixelCanvas, 0, 0, width, height, -width / 2 * scale, -height / 2 * scale, width * scale, height * scale);
        ctx.restore();
    }
}

function draw(t: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    offscreenBufferCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenBufferCtx.imageSmoothingEnabled = false;

    for (let i = 0; i < previousXMarkRegionIndices.length; i++) {
        const region = regions[previousXMarkRegionIndices[i]];
        grid.drawRegion(regionsCtx, region, GRID_SCALE);
    }
    previousXMarkRegionIndices.length = 0;
    // if (previousXMarkRegionIndices) grid.drawRegion(regionsCtx, previousXMarkRegionIndices, GRID_SCALE);

    const sourceX = camera.pos.x * GRID_SCALE;
    const sourceY = camera.pos.y * GRID_SCALE;
    const sourceWidth = camera.canvasSize.x * GRID_SCALE / camera.currentZoom
    const sourceHeight = camera.canvasSize.y * GRID_SCALE / camera.currentZoom;

    const destX = 0;
    const destY = 0;
    const destWidth = camera.canvasSize.x;
    const destHeight = camera.canvasSize.y;

    // Logic to pulse circle size
    circleSize += SIZE_SPEED * sizeDirection;
    if (circleSize > SIZE_MAX || circleSize < SIZE_MIN) sizeDirection *= -1; // Reverse direction

    let region = regions[depotIndex];
    for (let i = 0; i < xMarkIndices.length; i++) {
        offscreenBufferCtx.fillStyle = "red";
        region = regions[xMarkIndices[i]];
        grid.drawX(offscreenBufferCtx, region, GRID_SCALE);
        drawDropOffPoint(offscreenBufferCtx, region, "#f00", circleSize);
    }

    if (xMarkIndices.length === 0) {
        drawDropOffPoint(offscreenBufferCtx, region, "#F0E68C", circleSize);
    }

    if (player.active) player.draw(offscreenBufferCtx, GRID_SCALE);

    BulletPool.draw(offscreenBufferCtx, GRID_SCALE);
    drawAllGold(offscreenBufferCtx, GRID_SCALE);
    grid.drawChest(offscreenBufferCtx, depot, GRID_SCALE);

    for (let i = 0; i < ghosts.length; i++) {
        const enemy = ghosts[i];
        enemy.draw(offscreenBufferCtx, GRID_SCALE, t)
    }

    if (xMarkIndices.length > 0) {
        for (let i = 0; i < xMarkIndices.length; i++) {
            drawArrowToBuilding(offscreenBufferCtx, player.center, regions[xMarkIndices[i]]);
        }
    } else {
        drawArrowToBuilding(offscreenBufferCtx, player.center, regions[depotIndex]);
    }

    ctx.drawImage(roadCanvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    ctx.drawImage(regionsCanvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    if (started) ctx.drawImage(offscreenCanvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

    joystick.draw(ctx);

    drawLifeBar(ctx, canvas, player.life, 100);
    timeRemainingElement.textContent = formattedTime(GLOBAL.timeLeft);
    waveTimeElement.textContent = formattedTime(GLOBAL.nextWaveInTime);


}

function drawDropOffPoint(ctx: CanvasRenderingContext2D, region: IRegion, color: string, radius: number) {
    ctx.fillStyle = color;
    ctx.globalAlpha = .5; // Apply alpha transparency
    ctx.beginPath();
    ctx.arc(region.dropOffPoint.x * GRID_SCALE, region.dropOffPoint.y * GRID_SCALE, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1; // Reset alpha
}

function formattedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    return `${displayMinutes}:${displaySeconds}`;
}

function drawArrowToBuilding(ctx: CanvasRenderingContext2D, center: IPoint, building: IRegion) {
    const angle = calculateAngle(center.x, center.y, building.dropOffPoint.x, building.dropOffPoint.y) + Math.PI / 2;

    const TRIANGLE_SIZE = 10;
    const RADIUS_AROUND_PLAYER = player.radius + TRIANGLE_SIZE * 2.5;

    const cos = getCos(angle - Math.PI / 2);
    const sin = getSin(angle - Math.PI / 2);

    const circleX = player.center.x + cos * RADIUS_AROUND_PLAYER;
    const circleY = player.center.y + sin * RADIUS_AROUND_PLAYER;
    const color = building.type === "depot" ? "#F0E68C" : "red";
    drawTriangle(ctx, circleX * GRID_SCALE, circleY * GRID_SCALE, TRIANGLE_SIZE * GRID_SCALE, angle, color);
}
function drawLifeBar(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, life: number, maxLife: number) {
    ctx.save();
    ctx.translate(0, 5);
    ctx.beginPath();
    ctx.rect(10, 5, canvas.width - 20, 20);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(15, 10, (canvas.width - 30) * Math.max(life,0) / maxLife, 10);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, color: CanvasColor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size * 0.9, size);
    ctx.lineTo(size * 0.9, size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

// INPUT METHODS AND CALLBACKS
function keyCallback() {
    playerInputState.pos.x = keyboard.normalizedPos.x;
    playerInputState.pos.y = keyboard.normalizedPos.y;
    playerInputState.mode = "kb";
}

function joystickMoveCallback() {
    playerInputState.pos.x = joystick.normalizedPos.x;
    playerInputState.pos.y = joystick.normalizedPos.y;
    playerInputState.mode = "js";
}

// resize canvas to take up the whole screen (i.e. it takes 100% height and 100% width) but make sure the resolution doesn't exceed 1m pixels. CSS will stretch the canvas if it's too small.
function resizeCanvas() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale: number;

    if (width > height) {
        scale = MAX_DIMENSION / width;
        width = MAX_DIMENSION;
        height *= scale
    } else {
        scale = MAX_DIMENSION / height;
        height = MAX_DIMENSION;
        width *= scale;
    }

    canvas.width = width;
    canvas.height = height;
    camera.canvasSize.x = canvas.width;
    camera.canvasSize.y = canvas.height;
    joystick.resize();
}

function goldArrivedAtBoat(gold: IGold) {
    if (player.gold.every(g => g.arrived)) {
        UI_STATE.transferringCoins = false;
    }

    playCoinPickupSound();
}

function goldArrivedAtDepot(gold: IGold) {
    if (depot.gold.every(g => g.arrived)) {
        UI_STATE.transferringCoins = false;
        showUpgradeMenu();
    }

    playCoinPickupSound();
}

function showRestartMenu() {
    restartMenu.classList.remove("h");
    restartMenu.classList.add("s");
    restartMenu.style.pointerEvents = "auto";
    restartMenu.style.removeProperty("opacity");

    if (GLOBAL.timeLeft <= 0) {
        tryAgainElement.textContent = "You survived, me hearty!";
    } else {
        tryAgainElement.textContent = "You died, me hearty!";
    }

    surviveElement.textContent = formattedTime(GLOBAL.time);
    amountGoldElement.textContent = allGold.length.toString();
    amountRumElement.textContent = numRum.toString();
    endGoldRemainingElement.textContent = depot.gold.length.toString();
    ghostsPoppedElement.textContent = numGhostsPopped.toString();

    UI_STATE.restartMenuVisible = true;
}

function showUpgradeMenu() {
    upgradeButton.disabled = true;
    upgradeMenu.classList.remove("h");
    upgradeMenu.classList.add("s");
    upgradeMenu.style.pointerEvents = "auto";
    upgradeMenu.style.removeProperty("opacity");
    UI_STATE.upgradeMenuVisible = true;
    goldRemaining = depot.gold.length;

    const currentMenuItems = document.querySelectorAll('.upgrade-item');
    currentMenuItems.forEach(item => {
        item.removeEventListener('click', handleMenuItemClick);
    });

    currentMenuItems.forEach(item => {
        item.remove();
    });

    for (const upgrade of upgrades) {
        const tr = document.createElement('tr');
        tr.classList.add('upgrade-item');
        tr.setAttribute('data-selected', 'false');
        tr.setAttribute('data-cash', upgrade.cost.toString());
        tr.setAttribute('data-upgrade', upgrade.name);
        tr.innerHTML = `<td>${upgrade.name}</td><td>${upgrade.currentLevel}/${upgrade.maxLevel}</td><td>${upgrade.cost} Gold</td>`;
        upgradeTable.appendChild(tr);

    }

    const menuItems = document.querySelectorAll('.upgrade-item') as NodeListOf<HTMLElement>;
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });

    upgradeGoldRemainingElement.textContent = `Remaining gold: ${goldRemaining}`;
    disableMenuItems(menuItems);

}

function showStartMenu() {
    startMenu.classList.remove("h");
    startMenu.classList.add("s");
    startMenu.style.pointerEvents = "auto";
    startMenu.style.removeProperty("opacity");
}

function hideStartMenu() {
    startMenu.classList.remove("s");
    startMenu.style.pointerEvents = "none";
    startMenu.classList.add("h");
    started = true;
    createAudioContext()
    playFanfareSound();
    setTimeout(showWaveNumber, 500);
    const numEnemies = numEnemiesForWave(waveNumber);
    activateEnemies(numEnemies);
}

function numEnemiesForWave(wave: number): number {
    return WAVE_NUMBER_ENEMIES[wave-1];
}

function hideWaveNumber() {
    waveNumberElement.classList.remove("s");
    waveNumberElement.classList.add("h");
}

function showWaveNumber() {
    waveNumberElement.textContent = `Wave ${waveNumber}`;
    waveNumberElement.classList.remove("h");
    waveNumberElement.classList.add("s");

    setTimeout(hideWaveNumber, 2000);
}

function hideUpgradeMenu() {
    upgradeMenu.classList.remove("s");
    upgradeMenu.style.pointerEvents = "none";
    upgradeMenu.classList.add("h");
    UI_STATE.upgradeMenuVisible = false;

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.removeEventListener('click', handleMenuItemClick);
    });
}

function handleMenuItemClick(e: Event) {
    const element = (e.target as HTMLElement).parentNode as HTMLElement;
    const disabled = element.classList.contains("d");
    const isSelected = element.getAttribute('data-selected') === 'true';

    if (disabled && !isSelected) return;

    element.setAttribute('data-selected', (!isSelected).toString());
    element.style.backgroundColor = isSelected ? '' : '#F0E68C';
    element.style.color = isSelected ? '' : '#000';

    const menuItems = document.querySelectorAll('.upgrade-item') as NodeListOf<HTMLElement>;

    goldRemaining = depot.gold.length;
    upgradeButton.disabled = true;
    selectedUpgrades.length = 0;
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        const isSelected = item.getAttribute('data-selected') === 'true';
        const cost = parseInt(item.getAttribute('data-cash'));
        const upgrade = item.getAttribute('data-upgrade');

        if (isSelected) {
            goldRemaining -= cost;
            upgradeButton.disabled = false;
            selectedUpgrades.push(upgrade);
        }
    }

    disableMenuItems(menuItems);

    upgradeGoldRemainingElement.textContent = `Remaining gold: ${goldRemaining}`;
}

function disableMenuItems(menuItems: NodeListOf<HTMLElement>) {
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i] as HTMLElement;
        const cost = parseInt(item.getAttribute('data-cash'));
        const name = menuItems[i].getAttribute('data-upgrade');
        const isSelected = menuItems[i].getAttribute('data-selected') === 'true';
        const upgrade = findUpgrade(name);

        if (cost > goldRemaining && !isSelected) {
            item.classList.add("d");
        } else {
            item.classList.remove("d");
        }

        if (upgrade.currentLevel >= upgrade.maxLevel) {
            item.classList.add("d");
        }

    }
}
function addUpgrade(upgradeName: string) {
    const upgrade = findUpgrade(upgradeName);
    upgrade.currentLevel++;
    upgrade.cost = Math.floor(upgrade.cost * 3);

    if (upgradeName === "Add 2 Cannons") {
        player.regularGunLastFiredTimes.push(0,0);
    } else if (upgradeName === "Armor") {
        player.armorUpgrade = Math.max(player.armorUpgrade- .1, .5);
    } else if (upgradeName === "Speed Sails") {
        player.speedUpgrade = Math.min(player.speedUpgrade + .5, 2);
    } else if (upgradeName === "Questionable Rum") {
        numRum++;
    } else if (upgradeName === "Add 1 Target Cannon") {
        player.targetGunLastFiredTimes.push(0);
    } else if (upgradeName === "50% Damage Recovery") {
        player.life = player.life + Math.floor((100-player.life) * .5);
    } else if (upgradeName === "Cannonball Speed Up") {
        player.gunSpeed = Math.max(player.gunSpeed -.025, .01);
    } else {
        console.warn("Unknown upgrade: " + upgradeName);
    }
}

function findUpgrade(upgrade: string): IUpgrade {
    return upgrades.find(u => u.name === upgrade);
}

resizeCanvas()
grid.drawRoads(roadsCtx, GRID_SCALE);
grid.drawRegions(regionsCtx, regions, GRID_SCALE);
generateXMarkRegionIndexDistanceOrMoreAwayFromDepot(ROAD_WIDTH*3);
requestAnimationFrame(tick);
showStartMenu();
window.addEventListener('resize', resizeCanvas);
upgradeButton.addEventListener("click", () => {
    selectedUpgrades.forEach(upgrade => addUpgrade(upgrade));
    hideUpgradeMenu();
    depot.gold.length = goldRemaining;
    depot.gold.forEach(g => g.drawable = false);
    desiredXMarkDistance += (MAX_X_MARK_DISTANCE - desiredXMarkDistance) / 2;
    generateXMarkRegionIndexDistanceOrMoreAwayFromDepot(desiredXMarkDistance);

    selectedUpgrades.length = 0;
});

document.querySelector("#try-again-btn").addEventListener("click", () => {
    window.location.reload();
});

document.querySelector("#start-btn").addEventListener("click", () => {
    hideStartMenu();
});