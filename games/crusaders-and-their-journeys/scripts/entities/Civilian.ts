import { calculateHypotenuse } from "../utils";
import Crusader, { ESpriteDirection } from "./Crusader";

export default class Civilian extends Crusader {
  move(setNextSpriteFrame: boolean): void {
    if (this.moveTo) {
      const { step, direction } = calculateHypotenuse(this.position, this.moveTo);

      const posX = step.x * this.velocity * direction.x;
      const posY = step.y * this.velocity * direction.y;
      this.position.x += posX;
      this.position.y += posY;

      if (Math.abs(this.position.x - this.moveTo.x) > Math.abs(this.position.y - this.moveTo.y)) {
        this.spriteDirection = direction.x < 0 ? ESpriteDirection.Left : ESpriteDirection.Right;
      } else {
        this.spriteDirection = direction.y < 0 ? ESpriteDirection.Up : ESpriteDirection.Down;
      }
      
      if (setNextSpriteFrame) {
        this.sprite.config.frameIndex++;
        this.sprite.config.frameIndex %= this.sprite.config.frameSet;
      }

      if (Math.abs(this.position.x - this.moveTo.x) <= this.velocity && Math.abs(this.position.y - this.moveTo.y) <= this.velocity) {
        this.moveTo = null;
        this.sprite.config.frameIndex = 0;
      }
    }
  }
}
