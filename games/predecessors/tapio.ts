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

import { Character } from './character';
import { GridPosition } from './grid';
import { BlockType, GridMap, isBlocking } from './map';
import { Scene } from './scene';
import { randomInt } from './utils';

const FOREST_EXPANSION_INTERVAL_MS = 1000;
const ENEMY_SPAWN_INTERVAL_MS = 6000;

let maxEnemyCount = 0;

const getEnemySpawnCount = (forestCount: number): number => {
    // Number of enemies spawned is proportional to the amount of forest
    return Math.floor(forestCount / 80) + 1;
};

const findNewPosition = (map: GridMap): GridPosition | undefined => {
    for (let i = 0; i < 10; i++) {
        const forestPos = map.findRandomForest();

        if (forestPos) {
            const left = { xi: forestPos.xi - 1, yi: forestPos.yi };
            const right = { xi: forestPos.xi + 1, yi: forestPos.yi };
            const up = { xi: forestPos.xi, yi: forestPos.yi - 1 };
            const down = { xi: forestPos.xi, yi: forestPos.yi + 1 };

            const expansionBlocks = [left, right, up, down]
                .map((pos) => ({ pos, block: map.get(pos.xi, pos.yi) }))
                .filter((item) => item.block?.type === BlockType.Floor);

            if (expansionBlocks.length > 0) {
                return expansionBlocks[randomInt(expansionBlocks.length)].pos;
            }
        }
    }

    return undefined;
};

export class Tapio {
    constructor(spawnCount: number) {
        this.spawnCount = spawnCount;
        maxEnemyCount = maxEnemyCount < 60 ? (5 + spawnCount) * 3 : 60;
    }

    private lastExpandTime: number = 0;
    private lastSpawnTime: number = 0;
    private enemySpawnCount: number = 0;
    private firstSpawnDone = false;
    private spawnCount: number = 1;

    update(scene: Scene, now: number): void {
        const map = scene.map;

        // DEBUG
        // console.info(this.spawnCount);

        if (now - this.lastExpandTime > FOREST_EXPANSION_INTERVAL_MS) {
            this.expandForest(map);
            this.lastExpandTime = now;
        }

        if (!this.firstSpawnDone) {
            for (let i = 0; i < this.spawnCount; i++) {
                this.spawnEnemy(scene);
            }

            this.firstSpawnDone = true;
            this.lastSpawnTime = now;
        }

        if (
            now - this.lastSpawnTime > ENEMY_SPAWN_INTERVAL_MS &&
            this.enemySpawnCount <= maxEnemyCount
        ) {
            const numberOfEnemies = getEnemySpawnCount(map.forestCount);

            // console.log('Number of forest tiles:', map.forestCount);
            // console.log('Spawning', numberOfEnemies, 'enemies!');

            for (let i = 0; i < numberOfEnemies; i++) {
                this.spawnEnemy(scene);
            }

            this.lastSpawnTime = now;
        }
    }

    private expandForest(map: GridMap): void {
        const newPosition = findNewPosition(map);

        if (!newPosition) {
            return;
        }

        const type: BlockType =
            Math.random() < 0.6 &&
            // Do not place a tree unless there is space around it.
            map.everyNearby(
                newPosition.xi,
                newPosition.yi,
                (block) =>
                    !(isBlocking(block) || block?.type === BlockType.Tree),
            )
                ? BlockType.Tree
                : BlockType.Grass;

        map.set(newPosition.xi, newPosition.yi, {
            type,
            time: performance.now(),
        });
    }

    private spawnEnemy(scene: Scene): void {
        // Try 5 times
        for (let i = 0; i < 5; i++) {
            const position = scene.map.findRandomGrass();

            if (!position) {
                return;
            }

            if (scene.canAddEnemy(position)) {
                const enemy = new Character();
                enemy.isEnemy = true;
                scene.add(enemy, position);

                this.enemySpawnCount++;
                break;
            }
        }
    }
}
