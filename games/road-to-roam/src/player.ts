import { Sprite, SpriteSheet } from 'kontra';
import { loadImage } from './util';

export async function createFrontPlayer(canvas: HTMLCanvasElement): Promise<Sprite> {
    let frontImg = await loadImage('../assets/front.webp');
    let frontSheet = SpriteSheet({
        image: frontImg,
        frameWidth: 90,
        frameHeight: 200,
        frameMargin: 1,
        animations: {
            front: {
                frames: '0..1',
                frameRate: 4
            },
        }
    });

    let player = Sprite({
        anchor: { x: 0.5, y: 0.5 },
        x: canvas.width / 2,
        y: canvas.height / 4,
        animations: frontSheet.animations
    });
    return player;
}

export async function createRightSidePlayer(canvas: HTMLCanvasElement): Promise<Sprite> {
    let sideImg = await loadImage('../assets/rightside.webp');

    // The animations don't have the same height & width, so it's easier
    // to build a separate SpriteSheet instead of 2 animations on the same sheet
    let sideSheet = SpriteSheet({
        image: sideImg,
        frameWidth: 200,
        frameHeight: 200,
        frameMargin: 1,
        animations: {
            idle: {
                frames: '0..1',
                frameRate: 4
            },
        }
    });

    let player = Sprite({
        anchor: { x: 0.5, y: 0.5 },
        x: canvas.width / 2,
        y: canvas.height / 4,
        animations: sideSheet.animations
    });
    return player;
}

export async function createLeftSidePlayer(canvas: HTMLCanvasElement): Promise<Sprite> {
    let sideImg = await loadImage('../assets/leftside.webp');

    // The animations don't have the same height & width, so it's easier
    // to build a separate SpriteSheet instead of 2 animations on the same sheet
    let sideSheet = SpriteSheet({
        image: sideImg,
        frameWidth: 200,
        frameHeight: 200,
        frameMargin: 1,
        animations: {
            idle: {
                frames: '0..1',
                frameRate: 4
            },
        }
    });

    let player = Sprite({
        anchor: { x: 0.5, y: 0.5 },
        x: canvas.width / 2,
        y: canvas.height / 4,
        animations: sideSheet.animations
    });
    return player;
}

