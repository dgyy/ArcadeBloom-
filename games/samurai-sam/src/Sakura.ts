import { vec2, mainContext } from './littlejs';

export class Sakura {
  gradient: CanvasGradient;
  centerPos: vec2 = vec2(0, 0);
  pos: vec2 = vec2(0, 0);
  constructor() {
    this.centerPos = vec2(0, 0);
    const x = this.centerPos.x + this.pos.x;
    const y = this.centerPos.y + this.pos.y;
    this.gradient = mainContext.createRadialGradient(x, y, 100, 100, 100, 70);

    // Add three color stops
    this.gradient.addColorStop(0, 'orange');
    this.gradient.addColorStop(0.2, 'white');
    this.gradient.addColorStop(1, 'red');
  }
}
