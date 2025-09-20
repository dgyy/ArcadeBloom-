import { Point } from './utils';

export interface Actor {
  scale: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  meta?: any;
  remv?: boolean;
  getPos: () => Point;
  update: () => void;
  draw: () => void;
}

export const createActor = (): Actor => {
  const cl = {
    x: 0,
    y: 0,
    scale: 1,
    vx: 0,
    vy: 0,
    remv: false,
    getPos: (): Point => {
      return [cl.x, cl.y];
    },
    update: () => void 0,
    draw: () => void 0,
  };
  return cl;
};
