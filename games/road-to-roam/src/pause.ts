import { Text } from 'kontra';

export function createPause(canvas: HTMLCanvasElement): Text {
    return Text({
        text: 'paused',
        font: `italic ${canvas.height * 0.05}px Arial`,
        color: 'white',
        anchor: { x: 0.5, y: 0.5 },
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
    });
}

