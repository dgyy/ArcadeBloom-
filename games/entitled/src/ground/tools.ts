// const PI2 = Math.PI * 2.0;

export const zToColor = (z: number) => {
  if (z < 0 || z > 15) {
    throw new Error(`Z out of bounds (0 <= z < 16): ${z}`);
  }

  if (z < 10) {
    return `#${z.toString().repeat(6)}`
  }

  switch (z) {
    case 10:
      return '#aaaaaa';
    case 11:
      return '#bbbbbb';
    case 12:
      return '#cccccc';
    case 13:
      return '#dddddd';
    case 14:
      return '#eeeeee';
    case 15:
      return '#ffffff';
    default:
      throw new Error(`Z out of bounds (0 <= z < 16): ${z}`);
  }
}

export const zToTerrain = (z: number) => {
  return [
    '#5555ff',
    '#99ff99',
    '#66ff66',
    '#33ff33',
    '#00ff00',
    '#009900',
    '#006600',
    '#003300',
    '#333333',
    '#666666',
    '#999999',
    '#bbbbbb',
    '#ffffff',
    '#ff0000',
    '#ff9999',
  ][z];
};

export const cube = (heightcontext: CanvasRenderingContext2D, x: number, y: number, z: number, w: number, h: number) => {
  heightcontext.fillStyle = zToColor(z);
  heightcontext.fillRect(x, y, w, h);
}

export const pyramid = (heightContext: CanvasRenderingContext2D, x: number, y: number, zMin: number, zMax: number, side: number) => {
  let steps = zMax - zMin;
  let halfSide = Math.floor(side / 2.0);
  let stepSize = Math.floor(halfSide / steps);
  let z = zMin;

  for (let i = 0; i < halfSide; i++) {
    if ((i % stepSize) === 0) {
      z++;

      if (z > zMax) {
        z = zMax;
      }
    }

    heightContext.fillStyle = `rgba(${z},0,0)`;
    heightContext.fillRect(x + i, y + i, side - i, side - i);
  }
}

// export const ball = (heightContext: CanvasRenderingContext2D, x: number, y: number, r: number) => {
//   for (let i = 0; i < r; i--) {
//     heightContext.moveTo(x, y);
//     heightContext.beginPath();
//     heightContext.arc(x, y, r, 0, PI2);
//     heightContext.closePath();
//     heightContext.fill()
//   }
// }
