import { Vec2 } from "../utils.js";

export class EnemySpawnData {
  lastSpawnAt = undefined;
  active = false;
  interval = Math.random() * 5000 + 10000;

  constructor(x, y) {
    this.position = new Vec2(x, y);
  }
}
