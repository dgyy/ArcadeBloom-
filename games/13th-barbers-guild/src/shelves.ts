import { wrapper, move, hmirror, resize, skewY } from "./utils";
import { theme } from "./theme";

export function createShelves(width: number, height: number) {
  const x1 = 95;
  const x2 = 185;
  const y1 = 200;
  const y2 = 400;
  const delta = 50;
  const shelves = [
    move(shelf, x1, y1),
    move(shelf, x1, y2),
    hmirror(move(shelf, x1, y1)),
    hmirror(move(shelf, x1, y2)),
    skewY(resize(move(shelf, x2, y1 + delta), 1.5, 1), -5),
    skewY(resize(move(shelf, x2, y2 + delta), 1.5, 1), -5),
  ].join("");
  return wrapper(shelves, width, height, {
    style: `pointer-events: none; z-index: ${theme.layers.shelf}`,
  });
}

const front = `<polygon
  points="0,0 100,20 100,40 0,20"
  style="fill:${theme.shelfFront}"
/>`;

const side = `<polygon
  points="0,0 -10,20 -10,35 0,20"
  style="fill:${theme.shelfSide}"
/>`;

const bottom = `<polygon
  points="0,20 100,40 90,45 -10,35"
  style="fill:${theme.shelfBottom}"
/>`;

const shelf = `${move(front + side + bottom, 10, 70)}`;
