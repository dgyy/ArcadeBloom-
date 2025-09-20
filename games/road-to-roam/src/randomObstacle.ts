import { Sprite, randInt } from 'kontra';
import { GameState } from './gameState';
import { createObstacle } from './obstacle';
import { createArrow } from './arrow';
import { createWheel } from './wheel';

export async function randomObstacle(canvas: HTMLCanvasElement, gameState: GameState): Promise<Sprite> {
    let weight = randInt(1, 10);
    if (weight <= 6) {
        return createObstacle(canvas, gameState);
    }
    else if (weight <= 8) {
        return createArrow(canvas, gameState);
    }
    else {
        return createWheel(canvas, gameState);
    }
}

