import { getSound } from './db';
import { getCanvas } from './draw';
import { getGame } from './game';
import { Tile } from './room';
import { rand, zzfxPlaySound } from './zzfx';

export type Direction = 'l' | 'r';

export const getNow = () => {
  return window.performance.now();
};

export type Point = [number, number];
export type Point3d = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Circle = Point3d;
export type Rect = [number, number, number, number];

export const normalize = (
  x: number,
  a: number,
  b: number,
  c: number,
  d: number
) => {
  return c + ((x - a) * (d - c)) / (b - a);
};

export const at = ([x, y]: Point, arr: number[], width: number) => {
  if (x < 0 || x >= width) {
    return -Infinity;
  }
  if (y < 0 || y >= width) {
    return -Infinity;
  }

  return arr[x + y * width];
};

export const pointsEq = (p1: Point, p2: Point) => {
  // return '' + p1 === '' + p2;
  return p1?.[0] === p2?.[0] && p1?.[1] === p2?.[1];
};

export const timeoutPromise = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export class Timer {
  ms: number;
  s: number = -999;
  constructor(ms: number) {
    this.ms = ms;
  }
  start() {
    this.s = getNow();
  }
  stop() {
    this.s = 0;
  }
  pct() {
    const now = getNow();
    let diff = now - this.s;
    if (diff > this.ms) {
      diff = this.ms;
    } else if (diff < 0) {
      diff = -1;
    }
    return Math.min(1, diff / this.ms);
  }
  complete() {
    this.s = -999;
  }
  isDone() {
    return getNow() - this.s >= this.ms;
  }
}

const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  // console.log('keydown', e.key);
  keys[e.key] = true;

  const canvas = getCanvas();
  let cWidth = parseInt(canvas.style.width);
  if (isNaN(cWidth)) {
    cWidth = canvas.width;
  }
  if (e.key === '+') {
    cWidth += 100;
    canvas.style.width = cWidth + 'px';
    console.log('plus canv');
  }
  if (e.key === '-') {
    cWidth -= 100;
    canvas.style.width = cWidth + 'px';
    console.log('minus canv');
  }

  localStorage.setItem('js13k2023_tavernity_width', String(cWidth));
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

export const isKeyDown = (k: string) => {
  return keys[k];
};

export const dirToOffsets = (dir: Direction): Point => {
  switch (dir) {
    case 'l':
      return [-1, 0];
    case 'r':
      return [1, 0];
  }
};

export const playSound = (soundName: string) => {
  const s = getSound(soundName);
  zzfxPlaySound(s);
};

export const getModalText = (str: string) => {
  return `<div style="max-width:${getCanvas().width - 64}">${str}</div>`;
};

export const randInArr = (arr: any[]) => {
  return arr[Math.floor(rand() * arr.length)];
};

export const createAdjacentIterArray = (
  [x, y]: Point,
  includeDiags?: boolean
): Point[] => {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]?.concat(
    includeDiags
      ? [
          [x - 1, y - 1],
          [x - 1, y + 1],
          [x + 1, y - 1],
          [x + 1, y + 1],
        ]
      : []
  ) as Point[];
};

export const printArr = (arr: number[], w: number) => {
  let str = '';
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < w; j++) {
      const v = arr[j + i * w];
      str += ' ';
      if (v >= 0) {
        str += ' ';
      }
      str += v + ',';
    }
    str += '\n';
  }

  console.log(str);
};

// export const pxPosToTilePos = (px: number, py: number): Point => {
//   const tileWidth = 16;
//   const tileHeight = 16;
//   const x = px / tileWidth;
//   const y = py / tileHeight;
//   return [x, y];
// };
