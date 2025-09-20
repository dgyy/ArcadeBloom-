import { Text } from 'kontra';

export function createEnd(canvas: HTMLCanvasElement): Text {
    return Text({
        text: 'GAME OVER\nThanks for playing!\nClick to Restart',
        font: 'italic 32px Arial',
        color: 'white',
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
        lineHeight: 2,
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: canvas.width,
        height: canvas.height,
        onDown() {
            // This is a hack to restart the game
            location.reload();
        }
    });
}

