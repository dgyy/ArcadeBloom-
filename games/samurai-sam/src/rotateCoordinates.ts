import { vec2 } from './littlejs';

import { Cmd } from './types/Cmd';

export function rotateCoordinates(cmds: Cmd[], angle: number, center = vec2(0, 0)) {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = center.x;
  const cy = center.y;

  const rotateX = (x: number, y: number) => {
    const xDiff = x - cx;
    const yDiff = y - cy;
    return xDiff * cos - yDiff * sin + cx;
  };
  const rotateY = (x: number, y: number) => {
    const xDiff = x - cx;
    const yDiff = y - cy;
    return xDiff * sin + yDiff * cos + cy;
  };

  cmds.forEach((c) => {
    const { x0, y0, x1, y1, x2, y2, x, y } = c;
    if (!Number.isNaN(x0)) c.x0 = rotateX(c.x0, c.y0);
    if (!Number.isNaN(y0)) c.y0 = rotateY(c.x0, c.y0);
    if (!Number.isNaN(x1)) c.x1 = rotateX(c.x1, c.y1);
    if (!Number.isNaN(y1)) c.y1 = rotateY(c.x1, c.y1);
    if (!Number.isNaN(x2)) c.x2 = rotateX(c.x2, c.y2);
    if (!Number.isNaN(y2)) c.y2 = rotateY(c.x2, c.y2);
    if (!Number.isNaN(x)) c.x = rotateX(c.x, c.y);
    if (!Number.isNaN(y)) c.y = rotateY(c.x, c.y);
  });
}
