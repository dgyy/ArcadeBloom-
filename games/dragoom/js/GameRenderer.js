import SpriteSheet from "./SpriteSheet.js";
import Sprite from "./Sprite.js";

export default class GameRenderer {
  #containerEl;
  #sprites;
  #cellSizePx;
  #rows;
  #cols;

  #isRenderInitialized = false;
  #ctx;
  #cameraEl;

  constructor(containerEl, { cellSizePx, rows, cols }) {
    this.#containerEl = containerEl;
    this.#cellSizePx = cellSizePx;
    this.#rows = rows;
    this.#cols = cols;
  }

  async init(sprites) {
    this.#sprites = await this.#loadSprites(sprites);
  }

  async render({ background, camera, gameObjects }) {
    this.#initRender();

    this.#updateCamera(camera.position, camera.zoom);

    this.#renderBackground(background.sprites, background.color);

    this.#renderGameObjects(gameObjects);
  }

  async #initRender() {
    if (this.#isRenderInitialized) {
      return;
    }

    this.#cameraEl = this.#createCameraElement();

    const canvasEl = this.#createCanvasElement();
    this.#ctx = canvasEl.getContext("2d");

    this.#cameraEl.appendChild(canvasEl);

    this.#containerEl.innerHTML = "";
    this.#containerEl.appendChild(this.#cameraEl);

    this.#isRenderInitialized = true;
  }

  async #loadSprites(sprites) {
    // I liked having an object when defining the sprites to ensure there are no duplicate names,
    // but it is easier to work with an array of sprites here.
    sprites = Object.entries(sprites).map(([name, sprite]) => ({
      name,
      ...sprite,
    }));

    // Get a unique list of sprite sheets from our list of sprites I thought this was a nice way to
    // structure the data
    const spriteSheetPaths = new Set();
    sprites.forEach((sprite) => spriteSheetPaths.add(sprite.spriteSheet));

    // Create a map where the key is the path of the sprite sheet and the value is our SpriteSheet
    // object
    const spriteSheets = new Map();
    spriteSheetPaths.forEach((p) => spriteSheets.set(p, new SpriteSheet(p)));

    // Load all of the spritesheet images
    await Promise.all(
      [...spriteSheets.values()].map((spriteSheet) => spriteSheet.load())
    );

    // Create a map where the key is the name of the sprite and the value is our Sprite object
    const xsprites = new Map();
    sprites.forEach(({ name, spriteSheet, size, sheetX, sheetY }) => {
      const sprite = new Sprite({
        spriteSheetImg: spriteSheets.get(spriteSheet).img,
        size,
        sheetX,
        sheetY,
      });
      xsprites.set(name, sprite);
    });

    return xsprites;
  }

  #createCanvasElement() {
    const canvas = document.createElement("canvas");
    canvas.width = this.#cellSizePx * (this.#cols + 2);
    canvas.height = this.#cellSizePx * (this.#rows + 2);
    canvas.id = "gameboard-canvas";

    return canvas;
  }

  #createCameraElement() {
    const camera = document.createElement("div");

    return camera;
  }

  #updateCamera(position, zoom) {
    this.#cameraEl.style.transform = `scale(${zoom})`;
  }

  #renderBackground(sprites, color) {
    // Set the background color
    this.#containerEl.style.backgroundColor = color;

    // Render the background tiles
    for (let y = 0; y < this.#rows + 2; y++) {
      for (let x = 0; x < this.#cols + 2; x++) {
        let spriteID = sprites.MIDDLE;
        if (y === 0) {
          spriteID = sprites.TOP;
        } else if (y === this.#rows + 1) {
          spriteID = sprites.BOTTOM;
        } else if (x === 0) {
          spriteID = sprites.LEFT;
        } else if (x === this.#cols + 1) {
          spriteID = sprites.RIGHT;
        }
        const sprite = this.#sprites.get(spriteID);
        sprite.draw(this.#ctx, x, y, this.#cellSizePx);
      }
    }
  }

  #renderGameObjects(gameObjects) {
    [...gameObjects]
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(
        ({ spriteID, position, offsetY, offsetX, moving, movingProgress }) => {
          switch (moving) {
            case "UP":
              offsetY = this.#cellSizePx * -movingProgress + (offsetY || 0);
              break;
            case "DOWN":
              offsetY = this.#cellSizePx * movingProgress + (offsetY || 0);
              break;
            case "LEFT":
              offsetX = this.#cellSizePx * -movingProgress + (offsetX || 0);
              break;
            case "RIGHT":
              offsetX = this.#cellSizePx * movingProgress + (offsetX || 0);
              break;
          }
          const sprite = this.#sprites.get(spriteID);
          if (!sprite) {
            throw new Error(`Sprite ${spriteID} not found`);
          }
          sprite.draw(
            this.#ctx,
            position[0] + 1, // Add 1 to the position to account for the border
            position[1] + 1,
            this.#cellSizePx,
            offsetX,
            offsetY
          );
        }
      );
  }
}
