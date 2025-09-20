import { Sprite } from 'kontra';
import { GameState } from './gameState';
import { createObstacle } from './obstacle';

export async function createWheel(canvas: HTMLCanvasElement, gameState: GameState): Promise<Sprite> {
    let obj = await createObstacle(canvas, gameState, '../assets/wheel.webp');
    let sideFactor = Math.random() < 0.5 ? -1 : 1;
    obj.update = function() {
        this.dx = gameState.speed.x + sideFactor * gameState.speed.length();
        this.dy = gameState.speed.y;
        this.rotation += 3 * -sideFactor;
        this.advance();
    }
    obj.init = function() {
        this.x = canvas.width * 0.5 + canvas.width * (Math.random() + 0.5) * -sideFactor;
        this.y = canvas.height * 1.1;
        this.kill = false;
    }
    return obj;
}
