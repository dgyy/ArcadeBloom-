import {PIXEL_SIZE} from "./constants";

import { IEdge, IGridCell, IPoint, IPositionable, IRegion, IQueueItem} from "./interfaces";
import Ghost from "./ghost";
import Road from "./road";

import {distance, getCos, getSin, squaredDistance} from "./math";
import {drawPixels} from "./game_objects";
import {PointPool} from "./pools";


export const GRID_CELL_SIZE = 300;
export const GRID_SIZE_X = 10;
const GRID_SIZE_Y = 10;
export const GAME_WIDTH = GRID_CELL_SIZE * GRID_SIZE_X;
export const GAME_HEIGHT = GRID_CELL_SIZE * GRID_SIZE_Y;

const MAX_ROADS_PER_CELL = 10;
const MAX_ENEMIES_PER_CELL = 10;
const neighbors: IGridCell[] = [];

const OFFSETS = [
    {x: -1, y: 0}, // Left
    {x: 1, y: 0},  // Right
    {x: 0, y: -1}, // Top
    {x: 0, y: 1}   // Bottom
];

const X_PIXELS = [
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
];

const CHEST_PIXELS = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const X_PIXELS_COLOR_MAP = [null, "red"];

const CHEST_PIXELS_COLOR_MAP = ["#342d2a", "#8d6744"];

const xCanvas = document.createElement("canvas");
xCanvas.width = X_PIXELS[0].length * PIXEL_SIZE;
xCanvas.height = X_PIXELS.length * PIXEL_SIZE;
const xCtx = xCanvas.getContext("2d");
drawPixels(xCtx, X_PIXELS, X_PIXELS_COLOR_MAP, PIXEL_SIZE, 0,0,false);

const chestCanvas = document.createElement("canvas");
chestCanvas.width = CHEST_PIXELS[0].length * PIXEL_SIZE;
chestCanvas.height = CHEST_PIXELS.length * PIXEL_SIZE;

const chestCtx = chestCanvas.getContext("2d");
drawPixels(chestCtx, CHEST_PIXELS, CHEST_PIXELS_COLOR_MAP, PIXEL_SIZE);

export default class Grid {
    cells: Array<IGridCell> = [];
    cellSize: IPoint = {x: GRID_CELL_SIZE, y: GRID_CELL_SIZE};
    gameSize: IPoint = {x: GAME_WIDTH, y: GAME_HEIGHT};
    gridSize: IPoint = {x: GRID_SIZE_X, y: GRID_SIZE_Y};
    roads: Road[] = [];
    edges: IEdge[] = [];
    regions: IRegion[] = [];

    constructor() {
        // have to fill with undefined to chain with map
        for (let i = 0; i < this.gridSize.x * this.gridSize.y; i++) {
            this.cells.push({
                    index: i,
                    enemies: new Array(MAX_ENEMIES_PER_CELL).fill(null),
                    numEnemies: 0,
                    roads: new Array(MAX_ROADS_PER_CELL).fill(null),
                    numRoads: 0,
                    cost: 0
                }
            );
        }
    }

    setRoads(roads: Road[]) {
        this.roads = roads;

        // empty the cells of roads
        for (const cell of this.cells) {
            cell.numRoads = 0;
        }

        // go through the roads and get the number of cells each road occupies
        // then go through the cells and add the road to the cell's road array
        for (let i = 0; i < roads.length; i++) {
            const road = roads[i];
            const numCells = this.occupiedCells(road, road.occupiedCells);
            road.numOccupiedCells = numCells;
            for (let j = 0; j < numCells; j++) {
                const cell = road.occupiedCells[j];
                cell.roads[cell.numRoads] = road;
                cell.numRoads++;
            }
        }

        this.edges = [];
        for (const road of roads) {
            this.edges.push(road.edge);
        }
    }

    // TODO: combine getNeighborEnemies and getNearestEnemy
    getNeighborEnemies(pos: IPoint, enemies: Ghost[]): Ghost[] {
        neighbors.length = 0;
        const startCellIndex = indexForPos(pos.x, pos.y, GRID_SIZE_X);
        const visited: Set<number> = new Set();
        // const queue: IQueueItem[] = [{cellIndex: startCellIndex, depth: 0}];
        const startQueueItem: IQueueItem = PointPool.get(startCellIndex, 0);
        const queue: IQueueItem[] = [startQueueItem];

        let count = 0;

        while (queue.length > 0) {
            const queueItem = queue.shift()!;
            const {x: currentCellIndex, y: depth} = queueItem;
            PointPool.release(queueItem);

            if (depth > 2) break;

            visited.add(currentCellIndex);
            const currentCell = this.cells[currentCellIndex];

            for (let i = 0; i < currentCell.numEnemies; i++) {
                const enemy = currentCell.enemies[i];
                if (enemy && enemy.active) {
                    enemies[count] = enemy;
                    count++;
                    if (count >= enemies.length) {
                        emptyQueue(queue);
                        return enemies;
                    }
                }


            }

            this.setNeighborGridCells(currentCellIndex, neighbors);
            for (const neighbor of neighbors) {
                if (neighbor && !visited.has(neighbor.index)) {
                    const queueItem = PointPool.get(neighbor.index, depth + 1);
                    queue.push(queueItem);
                }
            }
        }

        emptyQueue(queue);
        return enemies;
    }

    getNearestEnemy(pos: IPoint, num: number): Ghost[] {
        neighbors.length = 0;
        const startCellIndex = indexForPos(pos.x, pos.y, GRID_SIZE_X);
        const visited: Set<number> = new Set();
        const startQueueItem: IQueueItem = PointPool.get(startCellIndex, 0);
        const queue: IQueueItem[] = [startQueueItem];

        let minDistance = Number.MAX_VALUE;
        let minEnemy: Ghost | null = null;
        const enemies: Ghost[] = [];

        while (queue.length > 0) {
            const queueItem = queue.shift()!;
            const {x: currentCellIndex, y: depth} = queueItem;
            PointPool.release(queueItem);

            if (depth > 3) break;

            visited.add(currentCellIndex);
            const currentCell = this.cells[currentCellIndex];

            for (let i = 0; i < currentCell.numEnemies; i++) {
                const enemy = currentCell.enemies[i];
                if (enemy) {
                    const d = distance(pos, enemy.center)
                    if (d < minDistance) {
                        minDistance = d;
                        minEnemy = enemy;
                        enemies.push(enemy);
                        if (enemies.length > num) enemies.shift();
                    }
                }
            }

            this.setNeighborGridCells(currentCellIndex, neighbors);
            for (const neighbor of neighbors) {
                if (neighbor && !visited.has(neighbor.index)) {
                    const queueItem = PointPool.get(neighbor.index, depth + 1);
                    queue.push(queueItem);
                }
            }
        }

        emptyQueue(queue)

        // return minEnemy;
        return enemies;
    }

    drawRoads(ctx: CanvasRenderingContext2D, scale: number = 1) {
        ctx.imageSmoothingEnabled = false;
        for (const road of this.roads) {
            road.draw(ctx, scale);
        }
    }

    drawX(ctx: CanvasRenderingContext2D, region: IRegion, scale: number = 1) {
        // ctx.drawImage(xCanvas, region.center.x * scale, region.center.y * scale);
        const height = X_PIXELS.length * PIXEL_SIZE;
        const width = X_PIXELS[0].length * PIXEL_SIZE;
        ctx.save();
        ctx.translate(region.center.x * scale, region.center.y * scale);
        ctx.drawImage(xCanvas, 0, 0, width, height, -width / 2 * scale, -height / 2 * scale, width * scale, height * scale);
        ctx.restore();
    }

    drawChest(ctx: CanvasRenderingContext2D, region: IRegion, scale: number = 1) {
        // ctx.drawImage(xCanvas, region.center.x * scale, region.center.y * scale);
        const height = CHEST_PIXELS.length * PIXEL_SIZE;
        const width = CHEST_PIXELS[0].length * PIXEL_SIZE;
        ctx.save();
        ctx.translate(region.center.x * scale, region.center.y * scale);
        ctx.drawImage(chestCanvas, 0, 0, width, height, -width / 2 * scale, -height / 2 * scale, width * scale, height * scale);
        ctx.restore();
    }

    drawRegions(ctx: CanvasRenderingContext2D, regions: IRegion[], scale: number = 1) {
        ctx.globalAlpha = 1.0
        for (const region of regions) {
            this.drawRegion(ctx, region, scale);
        }
    }

    drawRegion(ctx: CanvasRenderingContext2D, region: IRegion, scale: number = 1) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 1.0
        ctx.fillStyle = "#C2B280";
        ctx.beginPath();
        ctx.moveTo(region.vertices[0].x * scale, region.vertices[0].y * scale);
        for (let i = 1; i < region.vertices.length; i++) {
            const vertex = region.vertices[i];
            ctx.lineTo(vertex.x * scale, vertex.y * scale);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        // ctx.globalAlpha = .5
        ctx.beginPath();
        ctx.moveTo(region.shrunkPolygon.vertices[0].x * scale, region.shrunkPolygon.vertices[0].y * scale);
        for (let i = 1; i < region.shrunkPolygon.vertices.length; i++) {
            const vertex = region.shrunkPolygon.vertices[i];
            ctx.lineTo(vertex.x * scale, vertex.y * scale);
        }
        ctx.closePath();
        ctx.fillStyle = "#699169";
        ctx.fill();
        // ctx.globalAlpha = 1;
        ctx.restore();
    }

    setNeighborGridCells(currentIndex: number, neighborGridCells: IGridCell[]): Array<IGridCell> {
        // const neighbors: Array<IGridCell> = [];
        for (let i = 0; i < neighborGridCells.length; i++) {
            neighborGridCells[i] = null;
        }

        const {cells} = this;
        const width = this.gridSize.x;
        const height = this.gridSize.y;

        const x = currentIndex % width;
        const y = Math.floor(currentIndex / width);

        // Iterate over the offsets and calculate the neighbor coordinates
        for (let i = 0; i < OFFSETS.length; i++) {
            const offset = OFFSETS[i]
            const neighborX = x + offset.x;
            const neighborY = y + offset.y;

            // Check if the neighbor coordinates are within the grid bounds
            if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height) {
                const neighborIndex = neighborX + neighborY * width;
                // check that neighbor isn't null
                if (cells[neighborIndex]) neighborGridCells[i] = cells[neighborIndex];
            }
        }

        return neighborGridCells;
    }

    addToEnemyMap(enemy: Ghost) {
        const cell = this.cells[enemy.index];
        const numEnemies = cell.numEnemies;
        cell.enemies[numEnemies] = enemy;
        cell.numEnemies++;
    }

    clearEnemyMap() {
        for (const cell of this.cells) {
            for (let j = 0; j < cell.numEnemies; j++) {
                cell.enemies[j] = null;
            }
            cell.numEnemies = 0;
        }
    }

    occupiedCells(gameObject: IPositionable, occupiedCells: IGridCell[]): number {
        const {center, size, angle} = gameObject;
        const {cellSize, gridSize} = this;

        let i = 0;

        //Rasterize the object to determine the occupied cells
        // to do: use a fixed length array and keep track of the length
        for (let cellY = 0; cellY < gridSize.y; cellY++) {
            for (let cellX = 0; cellX < gridSize.x; cellX++) {
                const cellCenterX = cellX * cellSize.x + cellSize.x / 2;
                const cellCenterY = cellY * cellSize.y + cellSize.y / 2;

                // Check if the cell center is within the rotated object
                if (this.isPointInRotatedObject(cellCenterX, cellCenterY, center.x, center.y, size.x, size.y, angle)) {
                    const cellIndex = cellX + cellY * gridSize.x;

                    // warn if we're going to overflow the array
                    if (i >= occupiedCells.length) {
                        console.warn(`occupiedCells array overflow: ${occupiedCells.length} ${i}`);
                        break;
                    }

                    occupiedCells[i] = this.cells[cellIndex];
                    i++;
                }
            }
        }

        for (let j = i; j < occupiedCells.length; j++) {
            occupiedCells[j] = null;
        }

        return i;
    }

    isPointInRotatedObject(pointX: number, pointY: number, middleXPos: number, middleYPos: number, sizeX: number, sizeY: number, angle: number): boolean {
        const halfWidth = sizeX / 2;
        const halfHeight = sizeY / 2;

        // Transform the point to the object's local coordinate system
        const transformedX = pointX - middleXPos;
        const transformedY = pointY - middleYPos;

        const distanceSquared = (transformedX * transformedX) + (transformedY * transformedY);
        if (distanceSquared > (Math.max(halfWidth, halfHeight) * Math.max(halfWidth, halfHeight))) {
            return false;
        }

        // const cosAngle = Math.cos(angle);
        // const sinAngle = Math.sin(angle);

        // const { cos: cosAngle, sin: sinAngle } = getTrigValues(angle);
        const cosAngle = getCos(angle);
        const sinAngle = getSin(angle);

        // Apply the inverse rotation to the transformed point
        const rotatedX = transformedX * cosAngle + transformedY * sinAngle;
        const rotatedY = -transformedX * sinAngle + transformedY * cosAngle;

        // Check if the rotated point is within the object's bounding box
        return (
            rotatedX >= -halfWidth &&
            rotatedX <= halfWidth &&
            rotatedY >= -halfHeight &&
            rotatedY <= halfHeight
        );
    }
}

export function indexForPos(x: number, y: number, gridSizeX: number): number {
    const x2 = Math.floor(x / GRID_CELL_SIZE);
    const y2 = Math.floor(y / GRID_CELL_SIZE);
    return x2 + y2 * gridSizeX;
}

function emptyQueue(queue: IQueueItem[]) {
    for (let i = 0; i < queue.length; i++) {
        PointPool.release(queue[i]);
    }
    queue.length = 0;
}