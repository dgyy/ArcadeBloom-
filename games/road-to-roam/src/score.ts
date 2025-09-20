import { Text } from 'kontra';
import { GameState } from './gameState';

export function createScore(canvas: HTMLCanvasElement, gameState: GameState, bestScore: number): Text {
    let score = Text({
        text: '',
        font: `${canvas.width / 32}px Courier New`,
        color: 'white',
        x: 20,
        y: 20,
        value: 0,
        update() {
            score.value += -gameState.speed.y * 0.01;
            if (bestScore > 0) {
                // I want these to be on separate lines, but Kontra text doesn't work
                // correctly with string template literals with newlines in them...
                score.text = `Distance: ${score.value.toFixed(1)} m (Best: ${Math.max(score.value, bestScore).toFixed(1)} m)`;
            }
            else {
                score.text = `Distance: ${score.value.toFixed(1)} m`;
            }
        }
    });
    return score;
}
