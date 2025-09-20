import { addCastle } from "./castle";
import { Perlin } from "./perlin";

const toHeight = (v: number): number => Math.min(v * 255., 255.) | 0;

export const moor = (
  colorContext: CanvasRenderingContext2D,
  heightContext: CanvasRenderingContext2D,
  worldWidth: number,
  worldHeight: number,
) => {
  colorContext.fillStyle = `rgb(255, 255, 150)`;
  colorContext.fillRect(0, 0, worldWidth, worldHeight);
  heightContext.fillStyle = '#00ff00';
  heightContext.fillRect(0, 0, worldWidth, worldHeight);

  const w = Math.floor(worldWidth / 10.0);
  const h = Math.floor(worldHeight / 10.0);
  const p = new Perlin();

  // p.load();

  const values = [];

  for (let y = 0; y < h; y++) {
    let a = y / h * 3.;
    const row = new Array(w);

    for (let x = 0; x < w; x++) {
      let b = x / w * 3.;
      const v = p.get(b + 1.0, a + 1.0);
      const h = toHeight(v) | 0;
      row[x] = h;

      heightContext.fillStyle = `rgb(${h}, 0, 0)`;
      heightContext.fillRect(x * 10, y * 10, 10, 10);

      if (h <= 2) {
        colorContext.fillStyle = `rgb(100, 150, 255)`;
      } else {
        const c = Math.min(255. - Math.abs(v * 255.), 255.) | 0;
        colorContext.fillStyle = `rgb(${c}, 200, 100)`;
      }

      colorContext.fillRect(x * 10 | 0, y * 10 | 0, 10, 10);
    }

    values.push(row);
  }
};
