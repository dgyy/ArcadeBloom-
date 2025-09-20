import { Game } from "../core/game";
import { Ground } from "../ground";
import { HEX } from "../core/resources";
import { Vec3 } from "../core/vec3";
import { getId } from "./id";

const { cos, sin } = Math;
export const enum TEAM {
  PEASANT = 1,
  ROYALTY = 2,
}
export const UNIT = getId();

export class Unit {
  static TYPE = UNIT;

  public position: Vec3;
  public height: number;
  public width = 10;
  public color: HEX;
  public maxSpeed = 0;
  public reloadTime = 1000;
  public shotTime = 0;
  public health = 100;
  public healthMax = 100;
  public power = 5;
  public angle = 0;
  public range = 10;
  public isRemovable = false;
  public team = TEAM.PEASANT;
  public target?: Unit;
  public attackTargetColorFn: (color: HEX) => boolean;

  constructor(x: number, y: number, height: number, color: HEX) {
    this.position = new Vec3(x, y, 0);
    this.height = height;
    this.color = color;
  }

  update(dt: number, game: Game) {

  }

  attack({ ground }: Game, index: number) {

  }

  move(dt: number) {
    this.position.x = this.position.x + this.maxSpeed * cos(this.angle) * dt;
    this.position.y = this.position.y + this.maxSpeed * sin(this.angle) * dt;

    if (this.position.x >= 1024) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = 1023;
    }

    if (this.position.y >= 1024) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = 1023;
    }
  }

  damage(attacker: Unit) {
    this.health -= attacker.power;

    if (this.health <= 0) {
      this.isRemovable = true;
    }
  }
}
