import { createUniqueId } from './createUniqueId';
import { getCubicControlPoints } from './getCubicControlPoints';
import { Cmd } from './types/Cmd';

/**
 * Subidivide a cubic bezier curve. Will return two new curves
 *
 * @param {*} x0 startpoint
 * @param {*} y0
 * @param {*} x1 control point 1
 * @param {*} y1
 * @param {*} x2 control point 2
 * @param {*} y2
 * @param {*} x endpoint
 * @param {*} y
 * @param {*} u the subdivision ratio (between 0, and 1)
 */
export function subdivideCubicCurve(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  u: number
): Cmd[] {
  const { r0, r2, s0, s1, t0 } = getCubicControlPoints(x0, y0, x1, y1, x2, y2, x, y, u);

  const cmd1: Cmd = {
    id: createUniqueId(),
    x0,
    y0,
    x1: r0.x,
    y1: r0.y,
    x2: s0.x,
    y2: s0.y,
    x: t0.x,
    y: t0.y,
  };
  const cmd2: Cmd = {
    id: createUniqueId(),
    x0: t0.x,
    y0: t0.y,
    x1: s1.x,
    y1: s1.y,
    x2: r2.x,
    y2: r2.y,
    x: x,
    y: y,
  };
  return [cmd1, cmd2];
}
