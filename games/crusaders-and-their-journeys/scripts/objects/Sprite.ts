import { ESpriteDirection } from "../entities/Crusader";
import { changeImageColor } from "../utils";
import { ISize, IPosition } from "./GameObject";

export interface ISpriteUnit {
  width: number;
  height: number;
}

export interface ISpriteConfig {
  rows: number;
  columns: number;
  frameSize: ISize;
  frameSet: number;
  frameIndex: number;
}

export interface ISpriteDraw {
  row: number;
  column: number;
  x: number;
  y: number;
}

export default class Sprite {
  ctx: CanvasRenderingContext2D;
  sprite: HTMLImageElement | HTMLCanvasElement;
  config: ISpriteConfig;

  constructor(ctx: CanvasRenderingContext2D, path: string, config: ISpriteConfig, color?: string) {
    this.ctx = ctx;
    this.sprite = new Image();
    this.sprite.src = path;
    this.config = config;
    if (color) {
      this.sprite.addEventListener("load", () => {
        this.sprite = changeImageColor(this.sprite as HTMLImageElement, color);
      });
    }
  }

  draw(position: IPosition, direction: ESpriteDirection): void {
    const { width, height } = this.config.frameSize;
    const frameSetStart = this.config.frameSet * direction * width + (this.config.frameIndex * width);

    this.ctx.drawImage(this.sprite, frameSetStart, 0, width, height, position.x, position.y, width, height);
  }
}
