import { DEBUGGER } from '@/constants/game-conts';
import { drawEngine } from '@/core/draw-engine';

export class CollisionBlock {
    width = 16;
    height = 16;
    position: DOMPoint = new DOMPoint();
    constructor(position: DOMPoint) {
        this.position = position;
    }

    draw() {
        if (DEBUGGER) {
            drawEngine.context.fillStyle = 'rgba(255, 0, 0, 0.4)';
            drawEngine.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}