import { vec2 } from './littlejs';

import { getLineIntersection } from './getLineIntersection';

/**
 * Takes a cubic bezier curve, and check if the point, p, is inside the convex hull.
 */
export function isPointInConvexHull(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  p: vec2
) {
  // create a polygon (the convex hull of the curve)
  // create a line with p.
  // See if p intersects with any of the lines in the polygon
  // count the intersections. If number of intersections is odd, the point is iniside the polygon https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/

  // our polygon
  const line1 = { p1: vec2(x0, y0), p2: vec2(x1, y1) };
  const line2 = { p1: vec2(x1, y1), p2: vec2(x2, y2) };
  const line3 = { p1: vec2(x2, y2), p2: vec2(x, y) };
  const line4 = { p1: vec2(x, y), p2: vec2(x0, y0) };
  const lines = [line1, line2, line3, line4];

  const pointLine = {
    p1: vec2(p.x, p.y),
    p2: vec2(0, 99999),
  };

  let intersectionCount = 0;
  lines.forEach((line) => {
    const intersection = getLineIntersection(line.p1, line.p2, pointLine.p1, pointLine.p2);
    if (intersection != null) intersectionCount++;
  });
  return intersectionCount % 2 == 1;
}
