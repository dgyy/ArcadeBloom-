'use strict';
// source https://github.com/joeiddon/perlin/blob/master/perlin.js
// wiki: https://en.wikipedia.org/wiki/Perlin_noise

export interface Vec2 {
  x: number,
  y: number,
}

const randVec2 = (): Vec2 => {
  const theta = Math.random() * 2 * Math.PI;
  return {
    x: Math.cos(theta),
    y: Math.sin(theta)
  };
};

const smootherstep = (x: number) => {
  return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
};

const interp = (x: number, a: number, b: number): number => {
  return a + smootherstep(x) * (b - a);
};

const toCoord = (x: number, y: number): string => `${x},${y}`;

export class Perlin {
  public gradients: { [key: string]: Vec2 } = {};
  public memory: { [key: string]: number } = {};

  dot_prod_grid(x: number, y: number, vx: number, vy: number): number {
    let g_vec: Vec2;
    const d_vec: Vec2 = { x: x - vx, y: y - vy };

    if (this.gradients[toCoord(vx, vy)]) {
      g_vec = this.gradients[toCoord(vx, vy)];
    } else {
      g_vec = randVec2();
      this.gradients[toCoord(vx, vy)] = g_vec;
    }

    return d_vec.x * g_vec.x + d_vec.y * g_vec.y;
  };

  /**
   * Will produce flat surface if you start at the coord 0,0
   *
   * Return value: -1..1
  */
  get(x: number, y: number): number {
    let v = 0.;

    const xf = Math.floor(x);
    const yf = Math.floor(y);

    if (this.memory.hasOwnProperty(toCoord(x, y))) {
      v = this.memory[toCoord(x, y)];
    } else {
      //interpolate
      const tl = this.dot_prod_grid(x, y, xf, yf);
      const tr = this.dot_prod_grid(x, y, xf + 1, yf);
      const bl = this.dot_prod_grid(x, y, xf, yf + 1);
      const br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
      const xt = interp(x - xf, tl, tr);
      const xb = interp(x - xf, bl, br);
      const value = interp(y - yf, xt, xb);

      this.memory[toCoord(x, y)] = value;
      v = value;
    }


    return v;
  }

  save(key = "default") {
    localStorage.setItem(`perlin-memory-${key}`, JSON.stringify(this.memory));
    localStorage.setItem(`perlin-gradients-${key}`, JSON.stringify(this.gradients));
  }

  load(key = "default") {
    const memory = JSON.parse(localStorage.getItem(`perlin-memory-${key}`));

    if (memory) {
      this.memory = memory;
    }

    const gradients = JSON.parse(localStorage.getItem(`perlin-gradients-${key}`));

    if (gradients) {
      this.gradients = gradients;
    }
  }
}
