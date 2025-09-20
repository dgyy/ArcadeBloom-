/*
 *  Copyright 2023 Sami Heikkinen, Tero Jäntti
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Camera } from './camera';
import { Controls, getControls } from './controls';
import { easeInOutBack } from './easings';
import {
    TREE_IMAGE_HEIGHT,
    TREE_IMAGE_WIDTH,
    canvas,
    context,
    treeImage,
} from './graphics';
import { BlockType, GridMap, createMap, isBlocking } from './map';
import { Character } from './character';
import { Tapio } from './tapio';
import {
    GameObject,
    Movement,
    getDifference,
    getDistance,
    getDistanceToPoint,
} from './gameobject';
import { Scene } from './scene';
import { GridPosition } from './grid';
import { Item } from './item';

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 100;

const PLAYER_SPEED = 0.3;
const ENEMY_SPEED = 0.1;

const ENEMY_FOLLOW_DISTANCE = 600;

const CROSS_EFFECTIVE_TIME_MS = 4000;

export enum State {
    RUNNING,
    GAME_OVER,
    FINISHED,
}

enum MovementAxis {
    None,
    Horizontal,
    Vertical,
}

export class Level implements Scene {
    constructor(spawnCount: number) {
        this.add(this.player, { xi: 2, yi: 28 });

        this.insertItems();

        const screenSize = (canvas.width + canvas.height) / 2; // Average of width and height
        this.camera.follow(this.player);
        this.camera.zoom = screenSize / (14 * BLOCK_WIDTH);
        this.camera.update();

        this.spawnCount = spawnCount;

        this.tapio = new Tapio(this.spawnCount);
    }

    private camera: Camera = new Camera(this, canvas);
    private player: Character = new Character();
    private spawnCount: number = 10;
    private tapio: Tapio;
    private gameObjects: GameObject[] = [];

    private lastMovement: MovementAxis = MovementAxis.None;

    private crossPickTime?: number;

    map: GridMap = createMap();

    x = 0;
    y = 0;
    width = this.map.xCount * BLOCK_WIDTH;
    height = this.map.yCount * BLOCK_HEIGHT;

    state: State = State.RUNNING;

    private setState(newState: State): void {
        if (newState !== this.state) {
            this.state = newState;
        }
    }

    private insertItems(): void {
        this.add(new Item(), { xi: 3, yi: 15 });
        this.add(new Item(), { xi: 3, yi: 3 });
        this.add(new Item(), { xi: 12, yi: 24 });
        this.add(new Item(), { xi: 19, yi: 2 });
    }

    private getDistanceToObject(o: GameObject, position: GridPosition): number {
        const x = this.x + position.xi * BLOCK_WIDTH + BLOCK_WIDTH / 2;
        const y = this.y + position.yi * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;
        return getDistanceToPoint(o, x, y);
    }

    canAddEnemy(position: GridPosition): boolean {
        if (
            this.getDistanceToObject(this.player, position) <
            this.player.width * 20
        ) {
            return false;
        }

        const tooCloseToOtherEnemies = this.gameObjects.some((o) => {
            return (
                o instanceof Character &&
                o.isEnemy &&
                this.getDistanceToObject(o, position) < o.width * 3
            );
        });

        return !tooCloseToOtherEnemies;
    }

    add(o: GameObject, position: GridPosition): void {
        o.x = position.xi * BLOCK_WIDTH;
        o.y = position.yi * BLOCK_HEIGHT;
        this.gameObjects.push(o);
    }

    // return time left
    playerHasCross(now: number): number | undefined {
        if (this.crossPickTime == null) {
            return undefined;
        }

        const timeElapsed = now - this.crossPickTime;
        const timeLeft = CROSS_EFFECTIVE_TIME_MS - timeElapsed;

        return timeElapsed < CROSS_EFFECTIVE_TIME_MS ? timeLeft : undefined;
    }

    update(dt: number): void {
        if (this.state === State.GAME_OVER) {
            return;
        }

        const now = performance.now();
        const controls = getControls();

        this.camera.update();

        this.tapio.update(this, now);

        const objectsToRemove: GameObject[] = [];

        for (const o of this.gameObjects) {
            const isPlayer: boolean = o === this.player;
            const movement = isPlayer
                ? this.getPlayerMovement(dt, controls)
                : this.followPlayer(dt, now, o);

            this.move(o, movement);

            if (isPlayer) {
                if (this.hasReachedExit(o)) {
                    this.setState(State.FINISHED);
                }
            } else {
                if (o instanceof Character) {
                    if (getDistance(getDifference(o, this.player)) < 40) {
                        this.setState(State.GAME_OVER);
                    }
                }

                if (
                    o instanceof Item &&
                    getDistance(getDifference(o, this.player)) < 60
                ) {
                    objectsToRemove.push(o);
                    this.crossPickTime = now;
                }
            }
        }

        if (objectsToRemove.length > 0) {
            for (const removed of objectsToRemove) {
                this.gameObjects = this.gameObjects.filter(
                    (o) => o !== removed,
                );
            }
        }
    }

    private hasReachedExit(o: GameObject): boolean {
        // Is at the very right edge of the map.
        return this.x + this.width - 1.5 * BLOCK_WIDTH < o.x;
    }

    private getPlayerMovement(dt: number, controls: Controls): Movement {
        let dx = 0;
        let dy = 0;

        if (this.state === State.GAME_OVER) {
            return { dx: 0, dy: 0 };
        }

        const left = controls.ArrowLeft || controls.KeyA;
        const right = controls.ArrowRight || controls.KeyD;
        const up = controls.ArrowUp || controls.KeyW;
        const down = controls.ArrowDown || controls.KeyS;

        let horizontal = left || right;
        let vertical = up || down;

        if (horizontal && vertical) {
            if (this.lastMovement === MovementAxis.Horizontal) {
                horizontal = false;
            } else if (this.lastMovement === MovementAxis.Vertical) {
                vertical = false;
            }
        } else if (horizontal) {
            this.lastMovement = MovementAxis.Horizontal;
        } else if (vertical) {
            this.lastMovement = MovementAxis.Vertical;
        }

        if (horizontal) {
            if (left) {
                dx -= PLAYER_SPEED * dt;
            }
            if (right) {
                dx += PLAYER_SPEED * dt;
            }
        } else if (vertical) {
            if (up) {
                dy -= PLAYER_SPEED * dt;
            }
            if (down) {
                dy += PLAYER_SPEED * dt;
            }
        }

        return { dx, dy };
    }

    private followPlayer(dt: number, now: number, o: GameObject): Movement {
        const diff = getDifference(o, this.player);
        const distance = getDistance(diff);
        let dx = 0;
        let dy = 0;

        if (30 < distance && distance < ENEMY_FOLLOW_DISTANCE) {
            dx = Math.sign(diff.dx) * ENEMY_SPEED * dt;
            dy = Math.sign(diff.dy) * ENEMY_SPEED * dt;
        }

        if (this.playerHasCross(now) != null) {
            // Slow down enemies
            dx = dx * 0.2;
            dy = dy * 0.2;
        }

        return { dx, dy };
    }

    private move(o: GameObject, { dx, dy }: Movement): void {
        const newX = o.x + dx;
        const newY = o.y + dy;

        // Find the four blocks that the object may be touching
        // (assuming that the object is not bigger than one block)

        const minXIndex: number = Math.floor((newX - this.x) / BLOCK_WIDTH);
        const maxXIndex: number = Math.floor(
            (newX + o.width - this.x) / BLOCK_WIDTH,
        );
        const minYIndex: number = Math.floor((newY - this.y) / BLOCK_HEIGHT);
        const maxYIndex: number = Math.floor(
            (newY + o.height - this.y) / BLOCK_HEIGHT,
        );

        const blockUpLeft = isBlocking(this.map.get(minXIndex, minYIndex));
        const blockDownLeft = isBlocking(this.map.get(minXIndex, maxYIndex));
        const blockUpRight = isBlocking(this.map.get(maxXIndex, minYIndex));
        const blockDownRight = isBlocking(this.map.get(maxXIndex, maxYIndex));

        // Adjust movement if hitting a block

        if (dx < 0 && (blockUpLeft || blockDownLeft)) {
            dx = 0;
        } else if (dx > 0 && (blockUpRight || blockDownRight)) {
            dx = 0;
        }

        if (dy < 0 && (blockUpLeft || blockUpRight)) {
            dy = 0;
        } else if (dy > 0 && (blockDownLeft || blockDownRight)) {
            dy = 0;
        }

        o.move({ dx, dy });
    }

    draw(now: number): void {
        const cross: boolean = this.playerHasCross(now) != null;

        context.save();

        // Apply camera
        context.translate(canvas.width / 2, canvas.height / 2);
        context.scale(this.camera.zoom, this.camera.zoom);
        context.translate(-this.camera.x, -this.camera.y);

        // Fill background
        if (cross) {
            context.fillStyle = 'rgb(20, 40, 60)';
        } else {
            context.fillStyle = 'rgb(0, 20, 40)';
        }
        context.fillRect(this.x, this.y, this.width, this.height);

        // Calculate area that needs to be drawn
        const viewAreaWidth = canvas.width / this.camera.zoom;
        const viewAreaHeight = canvas.height / this.camera.zoom;

        const viewAreaMinX = this.camera.x - viewAreaWidth / 2;
        const viewAreaMaxX = viewAreaMinX + viewAreaWidth;
        const viewAreaMinY = this.camera.y - viewAreaHeight / 2;
        const viewAreaMaxY = viewAreaMinY + viewAreaHeight;

        const leftGridX = Math.floor(viewAreaMinX / BLOCK_WIDTH);
        const rightGridX = Math.floor(viewAreaMaxX / BLOCK_WIDTH) + 1;
        const topGridY = Math.floor(viewAreaMinY / BLOCK_HEIGHT);
        const bottomGridY = Math.floor(viewAreaMaxY / BLOCK_HEIGHT) + 2;

        const objectsVisibleOnCamera: GameObject[] = [];

        for (const o of this.gameObjects) {
            if (
                viewAreaMinX - BLOCK_WIDTH < o.x &&
                o.x + o.width < viewAreaMaxX + BLOCK_WIDTH &&
                viewAreaMinY - BLOCK_WIDTH < o.y &&
                o.y < viewAreaMaxY + BLOCK_WIDTH
            ) {
                objectsVisibleOnCamera.push(o);
            }
        }

        // Draw blocks
        for (let gridY = topGridY; gridY < bottomGridY; gridY++) {
            for (let gridX = leftGridX; gridX < rightGridX; gridX++) {
                const block = this.map.get(gridX, gridY);
                if (!block) {
                    continue;
                }

                const x = gridX * BLOCK_WIDTH;
                const y = gridY * BLOCK_HEIGHT;

                switch (block.type) {
                    case BlockType.Wall: {
                        if (cross) {
                            context.fillStyle = 'rgb(40, 70, 70)';
                        } else {
                            context.fillStyle = 'rgb(10, 40, 40)';
                        }
                        context.fillRect(
                            x,
                            y - BLOCK_HEIGHT / 2,
                            BLOCK_WIDTH,
                            BLOCK_HEIGHT,
                        );

                        if (cross) {
                            context.fillStyle = 'rgb(50, 80, 80)';
                        } else {
                            context.fillStyle = 'rgb(20, 50, 50)';
                        }
                        context.fillRect(
                            x,
                            y + BLOCK_HEIGHT / 2,
                            BLOCK_WIDTH,
                            BLOCK_HEIGHT / 2,
                        );
                        break;
                    }

                    case BlockType.Tree: {
                        // Grass:
                        if (cross) {
                            context.fillStyle = '#005000';
                        } else {
                            context.fillStyle = '#003000';
                        }
                        context.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);

                        const growthProgress =
                            Math.min(1000, now - block.time) / 1000.0;
                        const sizeRatio = Math.max(
                            0,
                            easeInOutBack(growthProgress),
                        );
                        const treeX =
                            x +
                            (BLOCK_WIDTH - TREE_IMAGE_WIDTH * sizeRatio) / 2;
                        const treeY =
                            y - (TREE_IMAGE_HEIGHT * sizeRatio - BLOCK_HEIGHT);

                        context.save();
                        context.translate(treeX, treeY);
                        context.scale(sizeRatio, sizeRatio);
                        if (this.playerHasCross(now) == null) {
                            context.filter = 'brightness(0.6)';
                        }
                        context.drawImage(
                            treeImage,
                            0,
                            0,
                            TREE_IMAGE_WIDTH,
                            TREE_IMAGE_HEIGHT,
                        );

                        context.restore();
                        break;
                    }

                    case BlockType.Grass: {
                        if (cross) {
                            context.fillStyle = '#005000';
                        } else {
                            context.fillStyle = '#003000';
                        }
                        context.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
                        break;
                    }

                    case BlockType.Floor:
                    default:
                        break;
                }
            }

            // Draw game objects that are on the current row, such that
            // they appear correctly behind or in front of the walls.
            const gameObjectsOnRow: GameObject[] = [];

            // Find out game objects that are on the same row.
            for (const o of objectsVisibleOnCamera) {
                const bottomY = o.y + o.height;
                const rowTopY = gridY * BLOCK_HEIGHT;
                const rowBottomY = gridY * BLOCK_HEIGHT + BLOCK_HEIGHT;

                if (rowTopY <= bottomY && bottomY < rowBottomY) {
                    gameObjectsOnRow.push(o);
                }
            }

            // Sort the game objects so they are drawn in the right order.
            gameObjectsOnRow.sort((a, b) => a.y + a.height - (b.y + b.height));

            for (const o of gameObjectsOnRow) {
                o.draw();
            }
        }

        // For debug drawing:
        //
        // context.strokeStyle = 'orange';
        // context.strokeRect(
        //     this.tapio.position.xi * BLOCK_WIDTH,
        //     this.tapio.position.yi * BLOCK_HEIGHT,
        //     BLOCK_WIDTH,
        //     BLOCK_HEIGHT,
        // );

        const centerX = this.player.x;
        const centerY = this.player.y;
        const visibleAreaLength =
            Math.max(canvas.width, canvas.height) / this.camera.zoom;

        // In case player is standing at the edge of the level, make
        // sure that the shadow area covers the entire screen.
        const shadowAreaLength = 2 * visibleAreaLength;

        const radius = shadowAreaLength / (cross ? 1 : 2);

        const gradient = context.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius,
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Transparent at the center
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 1)'); // Fully black at the outer edge

        context.fillStyle = gradient;
        context.fillRect(
            centerX - radius,
            centerY - radius,
            2 * radius,
            2 * radius,
        );
        context.restore();
    }
}
