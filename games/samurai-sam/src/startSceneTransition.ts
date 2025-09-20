import { timeDelta, overlayContext, canvasFixedSize } from './littlejs';

import { off, on } from './gameEvents';

export function startSceneTransition(duration = 1.5, onMiddle: () => void, onEnded: () => void) {
  let ellapsedTime = 0;
  const ctx: CanvasRenderingContext2D = overlayContext;
  let fillDirection = 1;
  const onTick = () => {
    ellapsedTime += timeDelta;
    if (ellapsedTime >= duration) {
      onEnded();
      off('tick', onTick);
      return;
    }

    let unfillRadius = 0;
    if (fillDirection) {
      unfillRadius = 400 - ellapsedTime * 1000;
    } else {
      unfillRadius = ellapsedTime * 1000 - 600;
    }
    if (unfillRadius <= -400) {
      onMiddle();
      fillDirection = 0;
    }
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(canvasFixedSize.x / 2, canvasFixedSize.y / 2);
    ctx.arc(canvasFixedSize.x / 2, canvasFixedSize.y / 2, canvasFixedSize.y, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(canvasFixedSize.x / 2, canvasFixedSize.y / 2, Math.max(0, unfillRadius), 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };
  on('tick', onTick);
}
