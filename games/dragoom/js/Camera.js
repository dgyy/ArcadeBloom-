export default class Camera {
  #position;
  #zoom = 1;
  #maxZoom = 4;
  #maxCellX;
  #maxCellY;

  static create({ cellsX, cellsY }) {
    const cellX = Math.floor(cellsX / 2);
    const cellY = Math.floor(cellsY / 2);
    return new Camera([cellX, cellY], cellsX, cellsY);
  }

  constructor(position, maxCellX, maxCellY) {
    this.#position = position;
    this.#maxCellX = maxCellX;
    this.#maxCellY = maxCellY;
  }

  getRenderState() {
    return {
      position: this.#position,
      zoom: this.#zoom,
    };
  }

  zoom(direction) {
    switch (direction) {
      case "IN":
        if (this.#zoom === this.#maxZoom) return;
        this.#zoom = this.#zoom + 1;
        break;
      case "OUT":
        if (this.#zoom === 1) return;
        this.#zoom = this.#zoom - 1;
        break;
    }
  }

  move(direction) {
    const [cellX, cellY] = this.#position;
    switch (direction) {
      case "UP":
        if (cellY === 0) return;
        this.#moveTo(cellX, cellY - 1);
        break;
      case "DOWN":
        if (cellY === this.#maxCellY) return;
        this.#moveTo(cellX, cellY + 1);
        break;
      case "LEFT":
        if (cellX === 0) return;
        this.#moveTo(cellX - 1, cellY);
        break;
      case "RIGHT":
        if (cellX === this.#maxCellX) return;
        this.#moveTo(cellX + 1, cellY);
        break;
    }
  }

  #moveTo(cellX, cellY) {
    this.#position = [cellX, cellY];
  }
}
