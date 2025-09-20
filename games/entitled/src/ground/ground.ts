import { rand, randInRange } from "../core/rand";
import { Unit } from "../units/unit";
import { addCastle } from "./castle";
import { moor } from "./moor";

const { max } = Math;

type ColorHeightMap = [Uint8ClampedArray, Uint8ClampedArray];

export class Ground {
  public width = 1024;
  public height = 1024;
  public shift = 10; // power of two: 2^10 = 1024
  public altitude = new Uint8Array(1024 * 1024); // 1024 * 1024 byte array with height information
  public color = new Uint32Array(1024 * 1024); // 1024 * 1024 int array with RGB colors
  public units = new Uint8Array(1024 * 1024); // 1024 * 1024 byte array with unit information
  public unitsColor = new Uint32Array(1024 * 1024); // 1024 * 1024 byte array with unit information

  damage(power: number, width: number, index: number) {
    for (let i = 0; i < width; i++) {
      const j = index + i * this.width;
      const result = max(this.altitude[j] - power, 5) | 0;

      if (result === 5) {
        this.color[j] += 1; // Hide the tile from "gray zone"
      }

      this.altitude[j] = result;
    }
  }

  toIndex(x: number, y: number): number {
    return x + y * this.width | 0;
  }

  createMap(): ColorHeightMap {
    let canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const colorContext = canvas.getContext("2d");

    if (colorContext === null) {
      throw new Error("colorContext not initialized");
    }

    canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const heightContext = canvas.getContext("2d");

    if (heightContext === null) {
      throw new Error("heightContext not initialized");
    }

    moor(colorContext, heightContext, this.width, this.height);
    addCastle(colorContext, heightContext, this.width / 2 | 0, this.height / 2 | 0, 80, 100);

    return [
      colorContext.getImageData(0, 0, this.width, this.height).data,
      heightContext.getImageData(0, 0, this.width, this.height).data,
    ];
  }

  load() {
    const [colorMap, heightMap]: ColorHeightMap = this.createMap();

    for (var i = 0; i < this.width * this.height; i++) {
      this.color[i] = 0xFF000000 | (colorMap[(i << 2) + 2] << 16) | (colorMap[(i << 2) + 1] << 8) | colorMap[(i << 2) + 0];
      this.altitude[i] = heightMap[i << 2];
    }

    this.clearUnits();
  }

  clearUnits() {
    this.units.fill(0);
  }

  isUnit(unit: Unit): boolean {
    const { x, y } = unit.position;
    const { color, height, width } = unit;
    const index = x + y * this.width | 0;
    return this.unitsColor[index] === color;
  }

  setUnit(unit: Unit) {
    const { x, y } = unit.position;
    const { color, height, width } = unit;

    for (let i = 0; i < width; i++) {
      let yy = y + i | 0;

      if (yy >= this.height) {
        break;
      }

      for (let j = 0; j < width; j++) {
        let xx = x + j | 0;

        if (xx >= this.width) {
          break;
        }

        const index = xx + yy * this.width | 0;
        this.units[index] = height | 0;
        this.unitsColor[index] = color;
      }
    }
  }

  getUnitsColorAt(index: number): number {
    return this.unitsColor[index];
  }

  getGroundColorAt(index: number): number {
    return this.color[index];
  }
}
