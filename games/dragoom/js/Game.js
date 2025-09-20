import GameRenderer from "./GameRenderer.js";
import Camera from "./Camera.js";
import TapGameObject from "./TapGameObject.js";
import BittyBudGameObject from "./BittyBudGameObject.js";
import BuildingGameObject from "./BuildingGameObject.js";
import { SPRITES } from "./constants.js";
import DragonGameObject from "./DragonGameObject.js";

export default class Game {
  #gameEl;
  #scoreEl;
  #roundEl;

  #fps = 60;
  #camera;
  #cellSize = 8;
  #cellsX = 9;
  #cellsY = 9;
  #zIndexSize = 10;
  #gameObjects = [];
  #score = 0;
  #round = 1;

  #isAddingBuilding = false;
  #maxNumBuildings = 4;

  #dragonInterval = 200;
  #dragonDelay = 1000;

  #onGameOver;

  constructor(gameEl, scoreEl, roundEl, onGameOver) {
    this.#gameEl = gameEl;
    this.#scoreEl = scoreEl;
    this.#roundEl = roundEl;
    this.#onGameOver = onGameOver;
  }

  get cellsX() {
    return this.#cellsX;
  }

  get cellsY() {
    return this.#cellsY;
  }

  get zIndexSize() {
    return this.#zIndexSize;
  }

  get dragonInterval() {
    return this.#dragonInterval;
  }

  get dragonDelay() {
    return this.#dragonDelay;
  }

  async start() {
    this.#camera = Camera.create(this);
    // Zoom in twice to make pixels fit perfectly - hax0r
    this.#camera.zoom("IN");
    this.#camera.zoom("IN");

    const renderer = new GameRenderer(this.#gameEl, {
      cellSizePx: this.#cellSize,
      cols: this.#cellsX,
      rows: this.#cellsY,
    });
    await renderer.init(SPRITES);

    this.setupBuildings();
    this.#gameObjects = [...this.#gameObjects, new DragonGameObject(this)];

    this.#scoreEl.addEventListener("animationend", () => {
      this.#scoreEl.classList.remove("animate__headShake");
    });
    this.#scoreEl.innerText = this.#score;

    this.#roundEl.addEventListener("animationend", () => {
      this.#roundEl.classList.remove("animate__headShake");
    });
    this.#roundEl.innerText = this.#round;

    let lastTime = 0;
    // Use 999 to force a render on the first frame
    let frameTimer = 999;
    const tick = async (t) => {
      const deltaTime = t - lastTime;
      if (frameTimer < 1000 / this.#fps) {
        frameTimer += deltaTime;
      } else {
        // Update game objects
        this.#gameObjects.forEach((g) => g.update(t));

        // Re-render the game every x frames per second
        await renderer.render(this.#getRenderState());
        frameTimer = 0;
        lastTime = t;
      }

      if (this.#isGameOver()) {
        this.#onGameOver({
          score: this.#score,
          round: this.#round,
        });
        return;
      }

      requestAnimationFrame(tick);
    };

    // Start our game loop
    await tick(0);
  }

  // Randomly add buildings up to the set maximum
  setupBuildings() {
    let i = 0;
    while (i < this.#maxNumBuildings) {
      const randX = Math.floor(Math.random() * this.#cellsX);
      const randY = Math.floor(Math.random() * this.#cellsY);
      if (this.addGameObject("BUILDING", randX, randY) !== false) {
        i++;
      }
    }
  }

  zoomCamera(direction) {
    this.#camera.zoom(direction);
  }

  moveCamera(direction) {
    this.#camera.move(direction);
  }

  handleClick(x, y) {
    const cell = this.#getCellAt(x, y);
    if (!cell) return;

    const [cellX, cellY] = cell;

    if (this.#isAddingBuilding) {
      this.addGameObject("BUILDING", cellX, cellY);
      return;
    }

    // add a bitty bud if they click a random number of times
    const objectAtCell = this.getGameObjectAt(cellX, cellY);
    if (objectAtCell instanceof BuildingGameObject) {
      // if it's on fire, put that baby out
      this.addGameObject("TAP", cellX, cellY);
      if (
        objectAtCell.isAlive(cellX, cellY) &&
        objectAtCell.isBuildingIgnited(cellX, cellY)
      ) {
        objectAtCell.extinguish(cellX, cellY);
        this.#increaseScore(20);
      }
    } else if (objectAtCell instanceof BittyBudGameObject) {
      this.addGameObject("TAP", cellX, cellY, {
        ignite: false,
      });
      if (objectAtCell.isIgnited()) {
        if (Math.random() > 0.85) {
          objectAtCell.extinguish();
          this.#increaseScore(25);
        }
      }
    } else {
      this.addGameObject("TAP", cellX, cellY);
    }
  }

  setIsAddingBuilding(isAddingBuilding) {
    this.#isAddingBuilding = isAddingBuilding;
  }

  getGameObjectAt(cellX, cellY) {
    return this.#gameObjects.find((g) => g.isAt(cellX, cellY));
  }

  #increaseScore(increment) {
    this.#score += increment;
    this.#scoreEl.innerText = this.#score;
    this.#scoreEl.classList.add("animate__headShake");

    if (this.#score / 100 >= this.#round) {
      this.#advanceRound();
    }
  }

  #advanceRound() {
    this.#round++;
    this.#roundEl.innerText = this.#round;
    this.#roundEl.classList.add("animate__headShake");

    // Make the dragoom go faster and faster
    this.#dragonInterval = Math.max(10, 200 * Math.pow(0.9, this.#round) + 10);
    this.#dragonDelay = Math.max(20, 990 * Math.pow(0.9, this.#round) + 10);
  }

  addGameObject(type, cellX, cellY, options = {}) {
    let gameObject;
    if (type === "TAP") {
      gameObject = new TapGameObject(this, cellX, cellY, options);
    } else if (type === "BITTY_BUD") {
      gameObject = new BittyBudGameObject(this, cellX, cellY, options);
      if (options.ignite) gameObject.ignite();
    } else if (type === "BUILDING") {
      const blockedCells = [
        [cellX, cellY],
        [cellX + 1, cellY],
        [cellX, cellY + 1],
        [cellX + 1, cellY + 1],
      ];
      if (blockedCells.some(([x, y]) => this.isCellBlocked(x, y))) return false;
      gameObject = new BuildingGameObject(this, cellX, cellY, options);
    }
    this.#gameObjects = [...this.#gameObjects, gameObject];

    return gameObject;
  }

  removeGameObject(gameObjectID, explodeAt = null) {
    if (explodeAt) {
      this.addGameObject("TAP", explodeAt[0], explodeAt[1]);
    }
    this.#gameObjects = this.#gameObjects.filter(
      (gameObject) => gameObject.gameObjectID !== gameObjectID
    );
  }

  findGameObject(gameObjectID) {
    return this.#gameObjects.find(
      (gameObject) => gameObject.gameObjectID === gameObjectID
    );
  }

  isCellBlocked(cellX, cellY) {
    if (!this.isValidCell(cellX, cellY)) return true;
    const objectAtCell = this.getGameObjectAt(cellX, cellY);
    if (objectAtCell?.isBlocking(cellX, cellY)) return true;
  }

  getClosestEmptyCell(cellX, cellY) {
    const cellsToCheck = [
      [cellX, cellY],
      [cellX + 1, cellY],
      [cellX - 1, cellY],
      [cellX, cellY + 1],
      [cellX, cellY - 1],
    ];

    const safeCell = cellsToCheck.find(([x, y]) => !this.isCellBlocked(x, y));
    if (safeCell) return safeCell;

    return null;
  }

  isValidCell(cellX, cellY) {
    if (cellX < 0 || cellX >= this.#cellsX) return false;
    if (cellY < 0 || cellY >= this.#cellsY) return false;
    return true;
  }

  #getCellAt(x, y) {
    const cellX = Math.floor(x / this.#cellSize);
    const cellY = Math.floor(y / this.#cellSize);

    if (cellX <= 0 || cellX > this.#cellsX) return null;
    if (cellY <= 0 || cellY > this.#cellsY) return null;

    // Subtract one to exclude the borders
    return [cellX - 1, cellY - 1];
  }

  #getRenderState() {
    return {
      background: {
        color: "#191c19",
        sprites: {
          TOP: "ROCK_1",
          RIGHT: "ROCK_1",
          LEFT: "ROCK_1",
          BOTTOM: "ROCK_1",
          MIDDLE: "GRASS_1",
        },
      },
      camera: this.#camera.getRenderState(),
      gameObjects: this.#gameObjects.reduce((acc, gameObject) => {
        const newAcc = [...acc, ...gameObject.getRenderState()];
        return newAcc;
      }, []),
    };
  }

  #isGameOver() {
    return this.#gameObjects.every((gameObject) => gameObject.isGameOver());
  }
}
