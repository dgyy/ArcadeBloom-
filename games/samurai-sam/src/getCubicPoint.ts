import { vec2 } from './littlejs';

/**
 * get a coordinate on the cubic bezier curve
 * @param {*} p0 either x0 or y0
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 * @param {*} u a number between 0 and 1. where 0 is the starting point, and 1 is the endpoint
 * @returns
 */
export function getCubicPoint(p0: vec2, p1: vec2, p2: vec2, p3: vec2, u: number) {
  const mt = 1 - u;
  return mt * mt * mt * p0 + 3 * mt * mt * u * p1 + 3 * mt * u * u * p2 + u * u * u * p3;
}
