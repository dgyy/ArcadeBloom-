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

import { Grid, GridPosition } from './grid';
import { randomInt } from './utils';

const BLOCK_X_COUNT = 30;
const BLOCK_Y_COUNT = 30;

export enum BlockType {
    Floor,
    Grass,
    Tree,
    Wall,
}

export type Block =
    | {
          type: BlockType.Floor | BlockType.Grass | BlockType.Wall;
      }
    | {
          type: BlockType.Tree;
          time: number;
      };

export const isBlocking = (block: Block | undefined): boolean => {
    return !!block && block.type === BlockType.Wall;
};

export const isForest = (block: Block | undefined): boolean => {
    return (
        !!block &&
        (block.type === BlockType.Grass || block.type === BlockType.Tree)
    );
};

const carveRectange = (
    map: GridMap,
    xBegin: number,
    xEnd: number,
    yBegin: number,
    yEnd: number,
): void => {
    for (let gridY = yBegin; gridY < yEnd; gridY++) {
        for (let gridX = xBegin; gridX < xEnd; gridX++) {
            map.set(gridX, gridY, { type: BlockType.Floor });
        }
    }
};

export class GridMap extends Grid<Block> {
    floorCount = 0;
    grassCount = 0;
    forestCount = 0;

    constructor() {
        super(BLOCK_X_COUNT, BLOCK_Y_COUNT, { type: BlockType.Wall });
    }

    override set(xIndex: number, yIndex: number, value: Block): void {
        const old = this.get(xIndex, yIndex);
        const oldType = old?.type;

        super.set(xIndex, yIndex, value);

        if (oldType !== BlockType.Floor && value.type === BlockType.Floor) {
            this.floorCount++;
        } else if (
            oldType === BlockType.Floor &&
            value.type !== BlockType.Floor
        ) {
            this.floorCount--;
        }

        if (oldType !== BlockType.Grass && value.type === BlockType.Grass) {
            this.grassCount++;
        } else if (
            oldType === BlockType.Grass &&
            value.type !== BlockType.Grass
        ) {
            this.grassCount--;
        }

        if (!isForest(old) && isForest(value)) {
            this.forestCount++;
        } else if (isForest(old) && !isForest(value)) {
            this.forestCount--;
        }
    }

    findRandomFloor(): GridPosition | undefined {
        return this.findRandom(
            this.floorCount,
            (block) => block?.type === BlockType.Floor,
        );
    }

    findRandomGrass(): GridPosition | undefined {
        return this.findRandom(
            this.grassCount,
            (block) => block?.type === BlockType.Grass,
        );
    }

    findRandomForest(): GridPosition | undefined {
        return this.findRandom(this.forestCount, isForest);
    }

    private findRandom(
        count: number,
        predicate: (block: Block | undefined) => boolean,
    ): GridPosition | undefined {
        const targetIndex: number = randomInt(count);
        let currentIndex: number = 0;

        for (let gridY = 0; gridY < this.yCount; gridY++) {
            for (let gridX = 0; gridX < this.xCount; gridX++) {
                const block = this.get(gridX, gridY);

                if (predicate(block)) {
                    if (currentIndex === targetIndex) {
                        return { xi: gridX, yi: gridY };
                    }

                    currentIndex++;
                }
            }
        }

        return undefined;
    }
}

export const createMap = (): GridMap => {
    const map = new GridMap();

    carveRectange(map, 1, 6, 20, 29); // bottom-left room (start)
    carveRectange(map, 8, 16, 20, 29); // bottom-center room
    carveRectange(map, 2, 4, 19, 20); // bottom-left doorway
    carveRectange(map, 11, 14, 19, 20); // bottom-center doorway

    carveRectange(map, 1, 16, 12, 19); // left-center room
    map.set(7, 16, { type: BlockType.Grass });
    map.set(8, 16, { type: BlockType.Grass });
    map.set(9, 16, { type: BlockType.Grass });
    map.set(6, 17, { type: BlockType.Grass });
    map.set(7, 17, { type: BlockType.Grass });
    map.set(8, 17, { type: BlockType.Grass });
    map.set(9, 17, { type: BlockType.Grass });
    map.set(6, 18, { type: BlockType.Grass });
    map.set(7, 18, { type: BlockType.Grass });
    map.set(8, 18, { type: BlockType.Grass });
    map.set(9, 18, { type: BlockType.Grass });

    map.set(14, 12, { type: BlockType.Grass });
    map.set(15, 12, { type: BlockType.Grass });
    map.set(15, 13, { type: BlockType.Grass });

    carveRectange(map, 2, 5, 11, 12); // doorway
    carveRectange(map, 1, 7, 1, 11); // top-left room
    map.set(1, 7, { type: BlockType.Grass });
    map.set(1, 8, { type: BlockType.Grass });
    map.set(1, 9, { type: BlockType.Grass });
    map.set(1, 10, { type: BlockType.Grass });
    carveRectange(map, 7, 8, 4, 8); // top-center doorway

    carveRectange(map, 11, 14, 11, 12); // doorway at center

    carveRectange(map, 8, 28, 1, 11); // top-right room
    map.set(12, 3, { type: BlockType.Grass });
    map.set(13, 3, { type: BlockType.Grass });
    map.set(13, 4, { type: BlockType.Grass });
    map.set(14, 3, { type: BlockType.Grass });
    map.set(14, 4, { type: BlockType.Grass });

    map.set(25, 1, { type: BlockType.Grass });
    map.set(26, 1, { type: BlockType.Grass });
    map.set(27, 1, { type: BlockType.Grass });
    map.set(26, 2, { type: BlockType.Grass });
    map.set(27, 2, { type: BlockType.Grass });
    map.set(26, 3, { type: BlockType.Grass });
    map.set(27, 3, { type: BlockType.Grass });

    map.set(26, 6, { type: BlockType.Grass });
    map.set(27, 6, { type: BlockType.Grass });
    map.set(26, 7, { type: BlockType.Grass });
    map.set(27, 7, { type: BlockType.Grass });
    map.set(26, 8, { type: BlockType.Grass });
    map.set(27, 8, { type: BlockType.Grass });
    map.set(26, 9, { type: BlockType.Grass });
    map.set(27, 9, { type: BlockType.Grass });
    map.set(26, 10, { type: BlockType.Grass });
    map.set(27, 10, { type: BlockType.Grass });

    map.set(16, 8, { type: BlockType.Grass });
    map.set(17, 8, { type: BlockType.Grass });
    map.set(18, 8, { type: BlockType.Grass });
    map.set(19, 8, { type: BlockType.Grass });
    map.set(16, 9, { type: BlockType.Grass });
    map.set(17, 9, { type: BlockType.Grass });
    map.set(18, 9, { type: BlockType.Grass });
    map.set(19, 9, { type: BlockType.Grass });
    map.set(20, 9, { type: BlockType.Grass });
    map.set(16, 10, { type: BlockType.Grass });
    map.set(17, 10, { type: BlockType.Grass });
    map.set(18, 10, { type: BlockType.Grass });
    map.set(19, 10, { type: BlockType.Grass });
    map.set(20, 10, { type: BlockType.Grass });

    carveRectange(map, 23, 26, 11, 14); // hallway on right
    carveRectange(map, 20, 28, 14, 28); // bottom-right room
    map.set(20, 14, { type: BlockType.Grass });
    map.set(21, 14, { type: BlockType.Grass });
    map.set(20, 15, { type: BlockType.Grass });

    map.set(24, 24, { type: BlockType.Grass });
    map.set(25, 24, { type: BlockType.Grass });
    map.set(26, 24, { type: BlockType.Grass });

    map.set(24, 25, { type: BlockType.Grass });
    map.set(25, 25, { type: BlockType.Grass });
    map.set(26, 25, { type: BlockType.Grass });

    map.set(23, 26, { type: BlockType.Grass });
    map.set(24, 26, { type: BlockType.Grass });
    map.set(25, 26, { type: BlockType.Grass });
    map.set(26, 26, { type: BlockType.Grass });

    map.set(23, 27, { type: BlockType.Grass });
    map.set(24, 27, { type: BlockType.Grass });
    map.set(25, 27, { type: BlockType.Grass });
    map.set(26, 27, { type: BlockType.Grass });

    carveRectange(map, 28, 30, 26, 28);

    return map;
};
