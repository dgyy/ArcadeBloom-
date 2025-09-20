import { TileEngine, Scene, load } from "kontra";
import Player from "./Player.js";
import Blob from "./Blob.js";
import Tileset from "./Tileset.js";
import Chest from "./Chest.js";
import Cart from "./Cart.js";
import Door from "./Door.js";
import { MapFile } from "./types.js";
import InteractiveSprite from "./InteractiveSprite.js";
import {
  CHEST,
  PLAYER_DOWN,
  CART_VERTICAL,
  CART_HORIZONTAL,
  BLOB,
  DOOR_CLOSED,
  OUTSIDE,
  CHICKEN_DOWN,
  CHICKEN_UP,
  CHICKEN_RIGHT,
  CHICKEN_LEFT,
} from "./sprites.js";
import Chicken from "./Chicken.js";

type ObjectType = Blob | Cart | Chest | Door | Player;

export default class Map {
  private mapFile: MapFile;
  private tileset: Tileset;
  private objects: Array<ObjectType>;
  private chickens: Array<Chicken>;
  public levelComplete: boolean = false;

  // fields initialized in init instead of constructor to allow for reinit
  private tileEngine?: TileEngine;
  private player?: Player;

  constructor(mapFile: MapFile, tileset: Tileset) {
    this.mapFile = mapFile;
    this.tileset = tileset;
    this.objects = [];
    this.chickens = [];

    this.init();
  }

  static async load(mapNumber: number, tileset: Tileset): Promise<Map> {
    return load(`assets/map${mapNumber}.json`).then(([mapFile]) => {
      return new Map(mapFile, tileset);
    });
  }

  init() {
    this.tileEngine = TileEngine({
      tilewidth: this.tileset.tileWidth, // tile size in pixels
      tileheight: this.tileset.tileHeight,
      width: this.mapFile.width, // map dimensions in tiles
      height: this.mapFile.height,
      tilesets: [
        {
          firstgid: 1,
          image: this.tileset.image,
        },
      ],
      layers: [
        {
          name: "background",
          data: Array(this.mapFile.width * this.mapFile.height).fill(OUTSIDE),
        },
        {
          name: "floor",
          data: this.mapFile.layers.floor,
        },
        {
          name: "structures",
          data: this.mapFile.layers.structures,
        },
      ],
    });

    this.objects = this.mapFile.layers.objects.flatMap((tile, index) => {
      const coord = this.coordinateFromCell(this.cellFromIndex(index));

      if (tile === CHEST) {
        return this.tileset.newChest(coord);
      }

      if (tile === PLAYER_DOWN) {
        return this.tileset.newPlayer(coord);
      }

      if (tile === CART_VERTICAL) {
        return this.tileset.newCart({
          ...coord,
          orientation: "vertical",
        });
      }

      if (tile === CART_HORIZONTAL) {
        return this.tileset.newCart({
          ...coord,
          orientation: "horizontal",
        });
      }

      if (tile === BLOB) {
        return this.tileset.newBlob(coord);
      }

      if (tile === DOOR_CLOSED) {
        return this.tileset.newDoor(coord);
      }

      if (tile === CHICKEN_UP) {
        return this.tileset.newChicken({ ...coord, direction: "up" });
      }

      if (tile === CHICKEN_DOWN) {
        return this.tileset.newChicken({ ...coord, direction: "down" });
      }

      if (tile === CHICKEN_LEFT) {
        return this.tileset.newChicken({ ...coord, direction: "left" });
      }

      if (tile === CHICKEN_RIGHT) {
        return this.tileset.newChicken({ ...coord, direction: "right" });
      }

      return [];
    });
    this.chickens = this.objects.filter((c) => c instanceof Chicken);

    this.player = this.objects.find((object) => object instanceof Player);
  }

  objectAtCoordinate(coordinate: {
    x: number;
    y: number;
  }): ObjectType | undefined {
    const index = this.indexFromCoordinate(coordinate);

    return this.objects.find((object) => {
      return this.indexFromCoordinate(object) === index;
    });
  }

  movePlayer(dx: number, dy: number) {
    if (!this.player || !this.tileEngine || this.player.isMoving()) {
      return;
    }

    const proposedX = this.player.x + Math.sign(dx) * 16;
    const proposedY = this.player.y + Math.sign(dy) * 16;
    const proposedCoordinate = { x: proposedX, y: proposedY };

    if (
      proposedX < 0 ||
      proposedX >= this.tileEngine.mapwidth ||
      proposedY < 0 ||
      proposedY >= this.tileEngine.mapheight
    ) {
      return;
    }

    const object = this.objectAtCoordinate(proposedCoordinate);
    if (object instanceof Chest) {
      object.open();
      return;
    } else if (object instanceof Door) {
      if (!object.isOpen) {
        object.open();
      } else {
        this.levelComplete = true;
      }
      return;
    } else if (object instanceof InteractiveSprite) {
      const cartProposedX = object.x + Math.sign(dx) * 16;
      const cartProposedY = object.y + Math.sign(dy) * 16;
      const cartProposedCoordinate = { x: cartProposedX, y: cartProposedY };

      if (
        this.mapFile.layers.structures[
          this.indexFromCoordinate(cartProposedCoordinate)
        ] ||
        this.objectAtCoordinate(cartProposedCoordinate)
      ) {
        return;
      }

      if (!object.moveTo(cartProposedX, cartProposedY)) {
        return;
      }
    }

    if (
      !this.mapFile.layers.structures[
        this.indexFromCoordinate(proposedCoordinate)
      ]
    ) {
      this.player.moveTo(proposedX, proposedY);
    }
  }

  update() {
    this.chickens.forEach((chicken) => {
      const proposedCoordinate = { x: chicken.x, y: chicken.y };
      if (chicken.direction === "left") {
        proposedCoordinate.x -= 16;
      } else if (chicken.direction === "right") {
        proposedCoordinate.x += 16;
      } else if (chicken.direction === "up") {
        proposedCoordinate.y -= 16;
      } else if (chicken.direction === "down") {
        proposedCoordinate.y += 16;
      }

      if (
        !this.mapFile.layers.structures[
          this.indexFromCoordinate(proposedCoordinate)
        ] &&
        !this.objectAtCoordinate(proposedCoordinate)
      ) {
        chicken.moveTo(proposedCoordinate.x, proposedCoordinate.y);
      }
    });

    this.objects.forEach((o) => o.update());
  }

  render() {
    this.tileEngine?.render();
    this.objects.forEach((o) => o.render());
  }

  private indexFromCell({ col, row }: { col: number; row: number }): number {
    return row * this.mapFile.width + col;
  }

  private indexFromCoordinate({ x, y }: { x: number; y: number }): number {
    return this.indexFromCell({
      col: Math.floor(x / this.tileset.tileWidth),
      row: Math.floor(y / this.tileset.tileHeight),
    });
  }

  private cellFromIndex(index: number): { col: number; row: number } {
    const col = index % this.mapFile.width;
    return {
      col,
      row: (index - col) / this.mapFile.width,
    };
  }

  private coordinateFromCell({ col, row }: { col: number; row: number }): {
    x: number;
    y: number;
  } {
    return {
      x: col * this.tileset.tileWidth,
      y: row * this.tileset.tileHeight,
    };
  }
}
