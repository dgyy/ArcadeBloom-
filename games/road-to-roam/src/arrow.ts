import { Sprite } from 'kontra';
import { createObstacle } from './obstacle';
import { GameState } from './gameState';

export async function createArrow(canvas: HTMLCanvasElement, gameState: GameState): Promise<Sprite> {
    let obj = await createObstacle(canvas, gameState, '../assets/arrow.webp');
    obj.update = function() {
        this.dx = gameState.speed.x;
        this.dy = gameState.speed.y - gameState.speed.length();
        this.advance();
    }
    return obj;
}
