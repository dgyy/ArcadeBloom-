export default class BuildingGameObject {
  #game;
  #cellX;
  #cellY;
  #pieces;
  #frame = 1;
  #gameObjectID;

  #destroyAfterFrames = 180;

  constructor(game, cellX, cellY) {
    this.#game = game;
    this.#cellX = cellX;
    this.#cellY = cellY;
    this.#gameObjectID = Math.random().toString(36).substring(7);
    this.#pieces = [
      {
        pieceID: "TOP_LEFT",
        position: [this.#cellX, this.#cellY],
        isIgnited: false,
        hp: 500,
      },
      {
        pieceID: "TOP_RIGHT",
        position: [this.#cellX + 1, this.#cellY],
        isIgnited: false,
        hp: 500,
      },
      {
        pieceID: "BOTTOM_LEFT",
        position: [this.#cellX, this.#cellY + 1],
        isIgnited: false,
        hp: 500,
      },
      {
        pieceID: "BOTTOM_RIGHT",
        position: [this.#cellX + 1, this.#cellY + 1],
        isIgnited: false,
        hp: 500,
      },
    ];
  }

  get gameObjectID() {
    return this.#gameObjectID;
  }

  isBlocking() {
    return true;
  }

  isGameOver() {
    return this.#pieces.every((piece) => piece.hp === 0);
  }

  isBuildingIgnited(cellX, cellY) {
    const piece = this.#findPieceAt(cellX, cellY);
    return piece.isIgnited;
  }

  isAlive(cellX, cellY) {
    const piece = this.#findPieceAt(cellX, cellY);
    return piece.hp > 0;
  }

  extinguish(cellX, cellY) {
    const piece = this.#findPieceAt(cellX, cellY);
    piece.isIgnited = false;
    this.#updatePiece(piece);
  }

  ignite(cellX, cellY) {
    const piece = this.#findPieceAt(cellX, cellY);
    piece.isIgnited = true;
    this.#updatePiece(piece);
  }

  isAt(cellX, cellY) {
    return !!this.#findPieceAt(cellX, cellY);
  }

  getRenderState() {
    let objects = [];
    this.#pieces.forEach(({ pieceID, isIgnited, position, hp }) => {
      objects.push({
        position,
        moving: null,
        movingProgress: null,
        zIndex: position[1] * this.#game.zIndexSize,
        offsetY: 0,
        spriteID: `BLDG_POST_${pieceID}`,
      });

      if (isIgnited && hp > 0) {
        objects.push({
          position,
          moving: null,
          movingProgress: null,
          zIndex: position[1] * this.#game.zIndexSize,
          offsetY: 0,
          spriteID: "FIRE_" + (this.#frame < 8 ? "3" : "4"),
        });
      } else if (isIgnited && hp === 0) {
        objects.push({
          position,
          moving: null,
          movingProgress: null,
          zIndex: position[1] * this.#game.zIndexSize,
          offsetY: 0,
          spriteID: "FIRE_1",
        });
      }
    });

    return objects;
  }

  update() {
    // TODO: This is a hack to make the fire animation work.
    this.#frame++;
    if (this.#frame % 16 === 0) {
      this.#frame = 0;
    }

    this.#pieces.forEach((piece) => {
      if (piece.isIgnited && piece.hp > 0) {
        piece.hp -= 1;
        this.#updatePiece(piece);
      }
    });
  }

  #findPieceAt(cellX, cellY) {
    return this.#pieces.find(
      ({ position: [x, y] }) => x === cellX && y === cellY
    );
  }

  #updatePiece(piece) {
    this.#pieces.splice(
      this.#pieces.findIndex(({ pieceID }) => pieceID === piece.pieceID),
      1,
      piece
    );
  }
}
