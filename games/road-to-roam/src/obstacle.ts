import { Sprite, randInt } from 'kontra';
import { GameState } from './gameState';
import { loadImage } from './util';

const images = [
    '../assets/rock1.webp',
    '../assets/rock2.webp',
    '../assets/tree1.webp',
    '../assets/tree2.webp',
];

export async function createObstacle(canvas: HTMLCanvasElement, gameState: GameState, imgPath: string = ''): Promise<Sprite> {
    let idx = randInt(0, images.length - 1);
    let img = await loadImage(imgPath || images[idx]);
    let sprite = Sprite({
        image: img,
        x: randInt(-canvas.width * 0.5, canvas.width * 1.5),
        y: canvas.height * 1.1,
        anchor: { x: 0.5, y: 0.5 },
        kill: false,
        update() {
            this.dx = gameState.speed.x;
            this.dy = gameState.speed.y;
            this.advance();
        },
        isAlive() {
            return !this.kill && this.y > -this.world.height * 2;
        }
    });
    sprite.setScale(canvas.width * 0.0005);
    return sprite;
}
