import { IPosition } from "../objects/GameObject";
import knightSprite from "../../../assets/knight.avif";
import Sprite from "../objects/Sprite";
import Crusader from "./Crusader";
import Bullet from "../objects/Bullet";
import { getRandomIntInclusive } from "../utils";

export default class Player {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  crusaders: Crusader[] = [];
  bulletList: Bullet[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.canvas = this.ctx.canvas;
    this.bulletList = [];
  }

  init(): void {
    this.setEvents();
    this.spawn();
  }
  spawn(): void {
    for (let i = 1; i <= 100; i++) {
      const sprite = new Sprite(this.ctx, knightSprite, { frameSize: { width: 40, height: 36 }, columns: 1, rows: 12, frameSet: 3, frameIndex: 0 });
      this.crusaders.push(new Crusader(this.ctx, sprite, i, 4));
    }

    for (let i = 0, y = 150; i < this.crusaders.length; i++) {
      if (i % 10 === 0) {
        y += this.crusaders[0].sprite.config.frameSize.width;
      }
      this.crusaders[i].position = { x: (i % 10) * this.crusaders[0].sprite.config.frameSize.width + this.canvas.width / 3, y };
    }
  }
  
  killCrusader(id: number): void {
    this.crusaders.splice(this.crusaders.findIndex(unit => unit.id === id), 1);
  }

  keyPressed: string;
  setEvents(): void {
    document.addEventListener("keydown", (e) => {
      this.keyPressed = e.code;
    });
    document.addEventListener("keyup", () => {
      this.keyPressed = null;
      this.crusaders.forEach(unit => {
        unit.sprite.config.frameIndex = 0;
      });
    });
    this.canvas.addEventListener("mousedown", (e) => {
      if (!e.button && this.crusaders.length) {
        this.attack(this.getRandomCrusader().getPositionCenter(), { x: e.clientX, y: e.clientY }, 16);
      }
    });
  }

  attack(startPosition: IPosition, endPosition: IPosition, velocity: number, color?: string) {
    const bullet: Bullet = new Bullet(
      this.ctx,
      { start: startPosition, end: endPosition },
      this.bulletList.length,
      velocity,
      color
    );
    this.bulletList.push(bullet);
  }

  destroyBullet(id: number): void {
    this.bulletList.splice(this.bulletList.findIndex(bullet => bullet.id === id), 1);
  }

  getRandomCrusader(): Crusader {
    return this.crusaders[getRandomIntInclusive(0, this.crusaders.length - 1)];
  }

  currentTimeFrame: number;
  setNextSpriteFrame: boolean;
  render(tFrame?: number): void {
    if (!this.currentTimeFrame && tFrame) {
      this.currentTimeFrame = tFrame;
    } else if (tFrame - this.currentTimeFrame > 16.6 * 3) {
      this.currentTimeFrame = tFrame;
      this.setNextSpriteFrame = true;
    } else {
      this.setNextSpriteFrame = false;
    }

    this.move();
    this.draw();
  }

  draw(): void {
    this.crusaders.forEach(unit => unit.draw());
    this.bulletList.forEach(bullet => {
      bullet.render();
    });
  }

  moveTo: IPosition;
  move(): void {
    if (this.keyPressed) {
      let x = 0, y = 0;
      switch (this.keyPressed) {
        case "ArrowUp":
        case "KeyW":
          y--;
          break;
        case "ArrowRight":
        case "KeyD":
          x++;
          break;
        case "ArrowDown":
        case "KeyS":
          y++;
          break;
        case "ArrowLeft":
        case "KeyA":
          x--;
          break;
        default: return;
      }
      this.crusaders.forEach(unit => unit.moveTo = { x, y });
    }
    this.crusaders.forEach(unit => unit.move(this.setNextSpriteFrame));
  }
}
