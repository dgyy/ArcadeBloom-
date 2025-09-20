export default class Sprite {
  #spriteSheetImg;
  #size;
  #sheetX;
  #sheetY;
  constructor({ spriteSheetImg, size, sheetX, sheetY }) {
    this.#spriteSheetImg = spriteSheetImg;
    this.#size = size;
    this.#sheetX = sheetX;
    this.#sheetY = sheetY;
  }
  draw(ctx, x, y, cellSize, offsetX = 0, offsetY = 0) {
    ctx.drawImage(
      this.#spriteSheetImg,
      this.#sheetX * this.#size,
      this.#sheetY * this.#size,
      this.#size,
      this.#size,
      x * cellSize + (offsetX ?? 0),
      y * cellSize + (offsetY ?? 0),
      cellSize,
      cellSize
    );
  }
}
