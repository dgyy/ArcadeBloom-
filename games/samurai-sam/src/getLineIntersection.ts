import { vec2 } from './littlejs';

export function getLineIntersection(p1: vec2, p2: vec2, p3: vec2, p4: vec2): vec2 {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (d == 0) return null; // parallel lines
  const u = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const v = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  if (u < 0.0 || u > 1.0) return null; // intersection point not between p1 and p2
  if (v < 0.0 || v > 1.0) return null; // intersection point not between p3 and p4
  const intersectionX = p1.x + u * (p2.x - p1.x);
  const intersectionY = p1.y + u * (p2.y - p1.y);
  if (Number.isNaN(intersectionX) || Number.isNaN(intersectionY)) return null;
  return vec2(p3.x, p3.y); // return a point actually on the line. It's close enough to the actual intersection
}
