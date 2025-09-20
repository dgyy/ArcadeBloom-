import { initInput, onInput, GameLoop, Text } from 'kontra';
import { GameState } from './gameState';

export function initInputs(gameState: GameState, gameLoop: GameLoop, canvas: HTMLCanvasElement, pause: Text) {
    initInput();

    onInput(['arrowleft', 'dpadleft'], () => {
        gameState.direction = Math.max(gameState.direction - 1, -2);
        gameState.useMouse = false;
    });

    onInput(['arrowright', 'dpadright'], () => {
        gameState.direction = Math.min(gameState.direction + 1, 2);
        gameState.useMouse = false;
    });

    onInput(['arrowdown', 'dpaddown'], () => {
        gameState.direction = 0;
        gameState.useMouse = false;
    });

    onInput(['esc', 'start'], () => {
        if (gameState.end) {
            return;
        }

        if (gameLoop.isStopped) {
            gameLoop.start();
        }
        else {
            gameLoop.stop();
            gameLoop.context.globalAlpha= 0.5;
            gameLoop.context.fillRect(0, 0, canvas.width, canvas.height);
            pause.render();
        }
    });

    onInput(['down'], () => {
        if (gameState.end) {
            // Refresh the browser window. Restart the "hard" way :)
            location.reload();
        }
    });
}

