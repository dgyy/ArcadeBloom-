export default class TapGameObject {
  #game;
  #cellX;
  #cellY;
  #frame = 1;
  #gameObjectID;
  #spriteID;

  constructor(game, cellX, cellY, { ignite = false } = {}) {
    this.#game = game;
    this.#cellX = cellX;
    this.#cellY = cellY;
    this.#gameObjectID = Math.random().toString(36).substring(7);
    if (ignite) {
      this.#spriteID = "FIRE_1";
    } else {
      this.#spriteID = "SMOKE_1";
    }
  }

  get gameObjectID() {
    return this.#gameObjectID;
  }

  isBlocking() {
    return false;
  }

  isGameOver() {
    return true;
  }

  isAt(cellX, cellY) {
    return this.#cellX === cellX && this.#cellY === cellY;
  }

  getRenderState() {
    return [
      {
        position: [this.#cellX, this.#cellY],
        moving: null,
        movingProgress: null,
        zIndex: this.#cellY * this.#game.zIndexSize * 3 + 4,
        offsetY: -3,
        spriteID: this.#spriteID,
      },
    ];
  }

  update() {
    if (this.#frame <= 7) {
      this.#frame += 0.5;
      this.#spriteID =
        this.#spriteID.split("_")[0] + "_" + Math.ceil(this.#frame);
      return;
    }
    this.#game.removeGameObject(this.gameObjectID);
  }
}
