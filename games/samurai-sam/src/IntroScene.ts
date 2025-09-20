import { canvasFixedSize } from './littlejs';

export class IntroScene {
  constructor() {}
  update() {}
  render(ctx) {
    ctx.save();
    ctx.font = `${32}px serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Samurai Sam', canvasFixedSize.x / 2, canvasFixedSize.y / 2);
    ctx.fillText('Touch screen or click to start', canvasFixedSize.x / 2, canvasFixedSize.y / 2 + 100);
    ctx.restore();
  }
}
