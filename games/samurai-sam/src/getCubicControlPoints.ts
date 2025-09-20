import { vec2 } from './littlejs';

export function getCubicControlPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  u: number
) {
  const r0 = vec2(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u);
  const r1 = vec2(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u);
  const r2 = vec2(x2 + (x - x2) * u, y2 + (y - y2) * u);
  const s0 = vec2(r0.x + (r1.x - r0.x) * u, r0.y + (r1.y - r0.y) * u);
  const s1 = vec2(r1.x + (r2.x - r1.x) * u, r1.y + (r2.y - r1.y) * u);
  const t0 = vec2(s0.x + (s1.x - s0.x) * u, s0.y + (s1.y - s0.y) * u);
  return { r0, r1, r2, s0, s1, t0 };
}
