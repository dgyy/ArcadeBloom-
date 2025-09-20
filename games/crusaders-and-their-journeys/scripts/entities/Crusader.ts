import GameObject, { IPosition } from "../objects/GameObject";
import Sprite from "../objects/Sprite";

export enum ESpriteDirection { Down, Left, Right, Up };

export default class Crusader extends GameObject {
  sprite: Sprite;
  spriteDirection: ESpriteDirection;
  moveTo: IPosition;
  velocity: number;
  isCollision: boolean;

  constructor(ctx: CanvasRenderingContext2D, sprite: Sprite, id: number, velocity: number) {
    super(ctx, id);
    this.sprite = sprite;
    this.spriteDirection = ESpriteDirection.Down;
    this.size = this.sprite.config.frameSize;
    this.id = id;
    this.velocity = velocity;
  }

  move(setNextSpriteFrame: boolean): void {
    if (this.moveTo) {
      this.position.x += this.moveTo.x * this.velocity;
      this.position.y += this.moveTo.y * this.velocity;
      
      if (this.moveTo.x) {
        this.spriteDirection = this.moveTo.x < 0 ? ESpriteDirection.Left : ESpriteDirection.Right;
      } else if (this.moveTo.y) {
        this.spriteDirection = this.moveTo.y < 0 ? ESpriteDirection.Up : ESpriteDirection.Down;
      }

      this.moveTo = null;

      if (setNextSpriteFrame) {
        this.sprite.config.frameIndex++;
        this.sprite.config.frameIndex %= this.sprite.config.frameSet;
      }
    }
  }

  draw(): void {
    this.sprite.draw(this.position, this.spriteDirection);
  }
}
