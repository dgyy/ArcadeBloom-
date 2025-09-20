import { vec2, timeDelta } from './littlejs';

import { MySvg } from './MySvg';
import { smoothstep } from './smoothstep';
import { off, on } from './gameEvents';

export function tween(svgs: MySvg[], from: vec2, to: vec2, duration: number) {
  let ellapsedTime = 0;
  svgs.forEach((svg) => svg.setPos(vec2(from.x, from.y)));
  const onTick = () => {
    ellapsedTime += timeDelta;
    const ratio = ellapsedTime / duration;
    const x = smoothstep(from.x, to.x, ratio);
    const y = smoothstep(from.y, to.y, ratio);
    svgs.forEach((svg) => svg.setPos(vec2(x, y)));
    if (ellapsedTime >= duration) {
      off('tick', onTick);
    }
  };
  on('tick', onTick);
}

export function tweenRot(svgs: MySvg[], from: number, to: number, duration: number, yoyo = false) {
  let ellapsedTime = 0;
  let direction = 1;
  svgs.forEach((svg) => svg.rotateSvg(from));
  const onTick = () => {
    ellapsedTime += timeDelta * direction;
    const ratio = ellapsedTime / duration;
    const angle = smoothstep(from, to, ratio);

    if (!svgs || !svgs.length) off('tick', onTick);

    if (ellapsedTime >= duration || ellapsedTime <= 0) {
      if (yoyo) {
        direction = direction * -1;
      } else {
        off('tick', onTick);
      }
    }
    svgs.forEach((svg) => {
      if (!svg) {
        off('tick', onTick);
        return;
      } else {
        svg.rotateSvg(angle, svg.getCenterPos());
      }
    });
  };
  on('tick', onTick);
}
