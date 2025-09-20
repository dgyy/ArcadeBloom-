import { IPosition } from "./objects/GameObject";

export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDirection(): number {
  return [1, -1][getRandomIntInclusive(0, 1)];
}

export function formatTime(time: number): string {
  return ("0" + time).slice(-2);
}

let _uuid: number = -1;
export function uuid(): number {
  return ++_uuid;
}

export function changeImageColor(image: HTMLImageElement, color: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";

  ctx.drawImage(image, 0, 0);

  return canvas;
}

interface ITrajectoryHypotenuse  {
  step: IPosition;
  direction: IPosition;
}
export function calculateHypotenuse(start: IPosition, end: IPosition): ITrajectoryHypotenuse {
  const direction = {
    x: start.x < end.x ? 1 : -1,
    y: start.y < end.y ? 1 : -1
  };

  const deltaDistance = {
    x: Math.abs(start.x - end.x),
    y: Math.abs(start.y - end.y)
  };

  const step = { x: 0, y: 0 };
  if (deltaDistance.x > deltaDistance.y) {
    step.x = 1;
    step.y = deltaDistance.y / deltaDistance.x;
  } else {
    step.y = 1;
    step.x = deltaDistance.x / deltaDistance.y;
  }

  return { step, direction };
}
