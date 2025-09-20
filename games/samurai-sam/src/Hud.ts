import { overlayContext } from './littlejs';
import { getCurrentScore } from './scoreUtils';

export class Hud {
  constructor() {}
  render() {
    overlayContext.save();
    const score = getCurrentScore();
    overlayContext.font = `${32}px serif`;
    overlayContext.fillStyle = 'white';
    overlayContext.fillText(score, 40, 60);
    overlayContext.restore();
  }
  update() {}
}
