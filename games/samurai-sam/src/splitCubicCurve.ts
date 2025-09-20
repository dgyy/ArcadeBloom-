import { vec2 } from './littlejs';

import { subdivideCubicCurve } from './subdivideCubicCurve';
import { Cmd } from './types/Cmd';
import { createUniqueId } from './createUniqueId';
import { getCubicControlPoints } from './getCubicControlPoints';

// /**
//  * Pass 1 cubic bezier curve, and return 2 cubic bezier curves, which is loosly equal to the original curve
//  * @param {*} x0
//  * @param {*} y0
//  * @param {*} x1
//  * @param {*} y1
//  * @param {*} x2
//  * @param {*} y2
//  * @param {*} x
//  * @param {*} y
//  * @param {*} t0 The point we have on the curve that we want to split from, assume it's on the curve someplace (by doing an intersection check)
//  */
// function _splitCubicCurve(
//   x0: number,
//   y0: number,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   x: number,
//   y: number,
//   t0: vec2
// ): Cmd[] {
//   const maxDepth = 7;
//   const getUValue = (x0, y0, x1, y1, x2, y2, x, y, t0, depth = 0, u = 0.5) => {
//     // try to subdivide the curve, and find a new point, tGuess, that is close enough to t0.
//     // Use a depth property as a measure to stop the algorithm, and assume the point is close enough.
//     // Use the convex hull property to discard curves where t0 does not exist.
//     const [c1, c2] = subdivideCubicCurve(x0, y0, x1, y1, x2, y2, x, y, 0.5);
//     if (depth == maxDepth) {
//       console.log('max u-depth', u);
//       return u;
//       // return [c1, c2]; // the point is close enough to where we want to split the curve
//     }
//     // if the point is not in the first curve, it must be in the second
//     depth += 1;
//     if (isPointInConvexHull(c1.x0, c1.y0, c1.x1, c1.y1, c1.x2, c1.y2, c1.x, c1.y, t0)) {
//       u = u - Math.pow(0.5, depth + 1);
//       return getUValue(c1.x0, c1.y0, c1.x1, c1.y1, c1.x2, c1.y2, c1.x, c1.y, t0, depth, u);
//     } else {
//       u = u + Math.pow(0.5, depth + 1);
//       return getUValue(c2.x0, c2.y0, c2.x1, c2.y1, c2.x2, c2.y2, c2.x, c2.y, t0, depth, u);
//     }
//   };
//   const splitRatio = getUValue(x0, y0, x1, y1, x2, y2, x, y, t0);
//   return subdivideCubicCurve(x0, y0, x1, y1, x2, y2, x, y, splitRatio);
// }
// export function splitCubicCurve(c: Cmd, t0: vec2): Cmd[] {
//   const curves = _splitCubicCurve(c.x0, c.y0, c.x1, c.y1, c.x2, c.y2, c.x, c.y, t0);
//   curves.forEach((curve) => {
//     curve.code = c.code;
//     curve.command = c.command;
//     curve.id = createUniqueId();
//   });
//   return curves;
// }

export function splitCubicCurve(c: Cmd, t0: vec2): Cmd[] {
  let closestU = 1;
  let currDistance = 99999;

  for (let i = 0; i < 0.99; i = i + 0.05) {
    const p1 = getCubicControlPoints(c.x0, c.y0, c.x1, c.y1, c.x2, c.y2, c.x, c.y, i);
    const newDistance = Math.abs(p1.t0.x - t0.x) + Math.abs(p1.t0.y - t0.y);
    if (newDistance < currDistance) {
      currDistance = newDistance;
      closestU = i;
    }
  }
  const curves = subdivideCubicCurve(c.x0, c.y0, c.x1, c.y1, c.x2, c.y2, c.x, c.y, closestU);
  curves.forEach((curve) => {
    curve.code = c.code;
    curve.command = c.command;
    curve.id = createUniqueId();
  });
  return curves;
}
