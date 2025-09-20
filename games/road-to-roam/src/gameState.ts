import { Vector } from 'kontra';

export interface GameState {
    direction: number;
    speed: Vector;
    life: number;
    muted: boolean;
    end: boolean;
    useMouse: boolean;
    spawnCounter: number;
    textureCounter: number;
}

export let gameState: GameState = {
    direction: 0,
    speed: Vector(0, 1),
    life: 3,
    muted: false,
    end: false,
    useMouse: false,
    spawnCounter: 0,
    textureCounter: 0,
};

