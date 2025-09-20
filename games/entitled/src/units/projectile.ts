import { Game } from "../core/game";
import { RED, returnFalse } from "../core/resources";
import { getId } from "./id";
import { TEAM, Unit } from "./unit";

export const PROJECTILE = getId();

export class Projectile extends Unit {
  static TYPE = PROJECTILE;

  update(dt: number, game: Game) {
    this.move(dt);

    if (this.height <= 0) {
      this.isRemovable = true;
    } else {
      this.height--;
    }

    this.shotTime += dt;

    if (this.shotTime > this.reloadTime) {
      const target = game.getOneInRange(this, TEAM.PEASANT);

      if (target) {
        this.shotTime = 0;
        target.damage(this);

        if (target.health <= 0) {
          target.health = target.healthMax;
          target.team = TEAM.ROYALTY;
          target.color = RED;
          target.isRemovable = false;
          target.target = game.getOneInRange(this, TEAM.PEASANT);
        }
      }
    }
  }
}

export const createProjectile = (x: number, y: number, thrower: Unit, maxSpeed: number, team: TEAM): Projectile => {
  const a = new Projectile(
    x,
    y,
    thrower.height,
    thrower.color
  );
  a.team = team;
  a.angle = thrower.angle;
  a.maxSpeed = maxSpeed;
  a.power = thrower.power;
  a.range = 100;
  a.attackTargetColorFn = returnFalse;
  return a;
}
