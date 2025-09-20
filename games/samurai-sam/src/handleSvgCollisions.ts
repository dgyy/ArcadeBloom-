import { MySvg } from './MySvg';
import { containsUniqueIntersectionPoint, handleLineCollisions } from './handleLineCollisions';

export function handleSvgCollisions(svg: MySvg, tolerance = 10) {
  const intersectionPoints = handleLineCollisions(svg);
  intersectionPoints.forEach((p) => {
    if (!containsUniqueIntersectionPoint(svg.intersectionPoints, p, tolerance)) {
      svg.addIntersectionPoint(p);
    }
  });
}
