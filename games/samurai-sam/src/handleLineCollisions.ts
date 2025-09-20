import { vec2 } from './littlejs';

import { getCubicControlPoints } from './getCubicControlPoints';
import { mousePoints, maxDraws } from './inputUtils';
import { getLineIntersection } from './getLineIntersection';
import { IntersectionPoint } from './types/IntersectionPoint';
import { MySvg } from './MySvg';

export function containsUniqueIntersectionPoint(
  points: IntersectionPoint[],
  newPoint: IntersectionPoint,
  tolerance = 10
) {
  let containsPoint = false;
  for (let existingPoint of points) {
    if (
      Math.abs(existingPoint.intersectionPoint.x - newPoint.intersectionPoint.x) <= tolerance &&
      Math.abs(existingPoint.intersectionPoint.y - newPoint.intersectionPoint.y) <= tolerance
    ) {
      containsPoint = true;
    }

    if (containsPoint) break;
  }
  return containsPoint;
}

export function containsUniquePoint(points: IntersectionPoint[], newPoint: vec2, tolerance = 10) {
  let containsUniquePoint = false;
  for (let existingPoint of points) {
    if (
      Math.abs(existingPoint.intersectionPoint.x - newPoint.x) <= tolerance &&
      Math.abs(existingPoint.intersectionPoint.y - newPoint.y) <= tolerance
    ) {
      containsUniquePoint = true;
    }
    if (containsUniquePoint) break;
  }
  return containsUniquePoint;
}
/**
 * Handle all collisions for the svg object, making sure that all collisions that happen in the same function is the same object
 * We check against the line the mouse creates
 */
export function handleLineCollisions(svg: MySvg): IntersectionPoint[] {
  const intersectionPoints: IntersectionPoint[] = []; // {id, point}, the id of the curve, and the point
  svg.cmds.forEach((cmd) => {
    if (cmd.code === 'C') {
      const { x0, y0, x1, y1, x2, y2, x, y } = cmd;

      for (let i = 0; i < 0.99; i = i + 0.05) {
        const p1 = getCubicControlPoints(x0, y0, x1, y1, x2, y2, x, y, i);
        const p2 = getCubicControlPoints(x0, y0, x1, y1, x2, y2, x, y, i + 0.05);
        for (let i = 0; i < mousePoints.length - 1; i++) {
          if (mousePoints[i + 1].draws <= maxDraws - 1) continue; // don't check old mouse points
          const prev = mousePoints[i];
          const next = mousePoints[i + 1];
          const intersectionPoint: vec2 = getLineIntersection(prev, next, p1.t0, p2.t0);
          if (intersectionPoint) {
            if (!containsUniquePoint(intersectionPoints, intersectionPoint)) {
              intersectionPoints.push({ id: cmd.id, intersectionPoint }); // TODO (johnedvard) maybe add the actual cmd pointer instead of ID
            }
          }
        }
      }
    }
  });
  return intersectionPoints;
}
