import { getPointer, Sprite, initPointer } from 'kontra';
import { GameState } from './gameState';

export function createPointer(gameState: GameState, canvas: HTMLCanvasElement) {
    initPointer();
    
    // This allows seamless switching between mouse and touch controls
    canvas.addEventListener('mousemove', () => gameState.useMouse = true, { passive: true });
}

export function pointerToDirection(gameState: GameState, player: Sprite): void {
    if (!gameState.useMouse) {
        return;
    }

    let { x: pointerX, y: pointerY } = getPointer();
    let { x: playerX, y: playerY } = player;

    let deltaX = pointerX - playerX;
    let deltaY = Math.abs(pointerY - playerY);

    // Avoid jank when the mouse is close to the player
    if (Math.hypot(deltaX, deltaY) < 10) {
        gameState.direction = 0;
        return;
    }

    let angle = Math.atan(deltaX / deltaY);
    if (angle <= -0.8) {
        gameState.direction = -2;
    }
    else if (angle <= -0.4) {
        gameState.direction = -1;
    }
    else if (angle <= 0.4) {
        gameState.direction = 0;
    }
    else if (angle <= 0.8) {
        gameState.direction = 1;
    }
    else {
        gameState.direction = 2;
    }
}

