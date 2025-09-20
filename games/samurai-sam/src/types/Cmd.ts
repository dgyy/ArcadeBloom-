import { CmdCode } from './CmdCode';

export type Cmd = {
  id: number;
  command?: 'closepath' | 'moveto' | 'curveto';
  code?: CmdCode;
  isIntersectionPoint?: boolean;
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};
