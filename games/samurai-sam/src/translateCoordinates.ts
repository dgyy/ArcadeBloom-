import { vec2 } from './littlejs';

import { Cmd } from './types/Cmd';

// Add the current SVG's global position to the points in the command;
export function translateCoordinates(cmds: Cmd[], pos: vec2) {
  cmds.forEach((c) => {
    const { x0, y0, x1, y1, x2, y2, x, y } = c;
    if (!Number.isNaN(x0)) c.x0 += pos.x;
    if (!Number.isNaN(y0)) c.y0 += pos.y;
    if (!Number.isNaN(x1)) c.x1 += pos.x;
    if (!Number.isNaN(y1)) c.y1 += pos.y;
    if (!Number.isNaN(x2)) c.x2 += pos.x;
    if (!Number.isNaN(y2)) c.y2 += pos.y;
    if (!Number.isNaN(x)) c.x += pos.x;
    if (!Number.isNaN(y)) c.y += pos.y;
  });
}
