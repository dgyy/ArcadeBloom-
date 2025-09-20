import BuildingGameObject from "./BuildingGameObject";
import BittyBudGameObject from "./BittyBudGameObject";

export default class DragonGameObject {
  #game;
  #cellX = -1;
  #cellY = -1;
  #gameObjectID;
  #lastTime = 0;
  #maxX;
  #maxY;
  #pos;
  #delayTime = 0;
  #delayed = false;

  constructor(game) {
    this.#game = game;
    this.#maxX = game.cellsX;
    this.#maxY = game.cellsY;
    this.#gameObjectID = Math.random().toString(36).substring(7);
    this.#startPos();
  }

  #startPos() {
    const directions = ["N", "S", "W", "E"];
    this.#pos = directions[Math.floor(Math.random() * directions.length)];
    switch (this.#pos) {
      case "N":
        this.#cellY = -1;
        this.#cellX = Math.floor(Math.random() * this.#maxX);
        break;
      case "S":
        this.#cellY = this.#maxY;
        this.#cellX = Math.floor(Math.random() * this.#maxX);
        break;
      case "W":
        this.#cellX = -1;
        this.#cellY = Math.floor(Math.random() * this.#maxY);
        break;
      case "E":
        this.#cellX = this.#maxX;
        this.#cellY = Math.floor(Math.random() * this.#maxY);
        break;
    }
  }

  update(t) {
    if (t - this.#delayTime < this.#game.dragonDelay) {
      this.#delayed = true;
      return;
    }

    if (t - this.#lastTime >= this.#game.dragonInterval) {
      this.#delayed = false;
      this.#lastTime = t;

      switch (this.#pos) {
        case "N":
          this.#cellY++;
          break;
        case "S":
          this.#cellY--;
          break;
        case "W":
          this.#cellX++;
          break;
        case "E":
          this.#cellX--;
          break;
      }

      if (
        this.#cellX < 0 ||
        this.#cellX > this.#maxX - 1 ||
        this.#cellY < 0 ||
        this.#cellY > this.#maxY - 1
      ) {
        this.#startPos();
        this.#delayTime = t;
        this.#delayed = true;
        return;
      }

      const objectAtCell = this.#game.getGameObjectAt(this.#cellX, this.#cellY);
      if (objectAtCell instanceof BuildingGameObject) {
        this.#game.addGameObject("TAP", this.#cellX, this.#cellY, {
          ignite: true,
        });
        const isAlive = objectAtCell.isAlive(this.#cellX, this.#cellY);
        if (
          isAlive &&
          !objectAtCell.isBuildingIgnited(this.#cellX, this.#cellY)
        ) {
          objectAtCell.ignite(this.#cellX, this.#cellY);
        }

        if (isAlive) {
          const safeCell = this.#game.getClosestEmptyCell(
            this.#cellX,
            this.#cellY
          );
          if (safeCell) {
            const bitty = this.#game.addGameObject(
              "BITTY_BUD",
              safeCell[0],
              safeCell[1],
              {
                ignite: Math.random() > 0.5,
              }
            );
            bitty.update();
            this.#game.addGameObject("TAP", safeCell[0], safeCell[1]);
          }
        }
      } else if (objectAtCell instanceof BittyBudGameObject) {
        if (!objectAtCell.isIgnited()) {
          objectAtCell.ignite();
        }
      } else {
        this.#game.addGameObject("TAP", this.#cellX, this.#cellY, {
          ignite: true,
        });
      }
    }
  }

  isAt() {
    return false;
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

  getRenderState() {
    if (this.#delayed) {
      return [];
    }

    return [
      {
        position: [this.#cellX, this.#cellY],
        moving: null,
        movingProgress: null,
        zIndex: 1000000,
        spriteID: "DRAGON_TOP_LEFT",
      },
      {
        position: [this.#cellX + 1, this.#cellY],
        moving: null,
        movingProgress: null,
        zIndex: 1000000,
        spriteID: "DRAGON_TOP_RIGHT",
      },
      {
        position: [this.#cellX, this.#cellY + 1],
        moving: null,
        movingProgress: null,
        zIndex: 1000000,
        spriteID: "DRAGON_BOTTOM_LEFT",
      },
      {
        position: [this.#cellX + 1, this.#cellY + 1],
        moving: null,
        movingProgress: null,
        zIndex: 1000000,
        spriteID: "DRAGON_BOTTOM_RIGHT",
      },
    ];
  }
}
