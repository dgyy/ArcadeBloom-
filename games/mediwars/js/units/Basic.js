import { Unit } from "../Unit";
import { SPRITE_WIDTH } from "../constants";

export class Basic extends Unit {
  #sprite = [
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 3, 3, 2, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0],
  ];

  #colors = {
    0: 'rgba(0,0,0,0)',
    1: '#5e5c57',
    2: '#f7d180',
    3: '#2d88ef',
  }

  /**
   * Draw on game world
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx, offset) {
    const len = this.#sprite.length;
    for (let y=0; y<len; y++) {
      for (let x=0; x<len; x++) {
        ctx.fillStyle = this.#colors[this.#sprite[y][x]];
        // ctx.fillRect(this.x * TILE_WIDTH + x * 2, this.y * TILE_WIDTH + y * 2, 2, 2);
        ctx.fillRect(this.x * SPRITE_WIDTH + x + offset[0], this.y * SPRITE_WIDTH + y + offset[1], 1, 1);
      }
    }
  }
}