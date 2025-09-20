import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class SwordIcon extends GameObjectClass {
  constructor(x: number, y: number, scale: number = 0.5) {
    super({ x, y });
    this.setScale(scale);
  }

  draw() {
    drawPolygon(
      this.context,
      "10 18 23 5 24 0 19 1 6 14 4 13 2 15 4 17 0 22 1 23 2 24 7 20 9 22 11 20 10 18",
      COLOR.WHITE_6
    );
  }
}
