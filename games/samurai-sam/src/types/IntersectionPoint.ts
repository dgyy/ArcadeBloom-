import { vec2 } from '../littlejs';

export type IntersectionPoint = {
  id: number; // id of the The curve (cmd) the collision was found
  intersectionPoint: vec2;
};
