import { Game } from "../core/game";
import { randInRange } from "../core/rand";
import { HEX, LIGHT_BLUE, returnFalse } from "../core/resources";
import { getId } from "./id";
import { createProjectile } from "./projectile";
import { TEAM, Unit } from "./unit";

export const TOWER = getId();

export class Tower extends Unit {
  static TYPE = TOWER;
  public projectiles = 1;

  update(dt: number, game: Game) {
    this.shotTime += dt;

    if (this.shotTime > this.reloadTime) {
      const target = game.getOneInRange(this, TEAM.PEASANT);

      if (target) {
        this.angle = this.position.angleXY(target.position);
        this.shotTime = 0;

        if (this.projectiles === 1) {
          game.actors.push(createProjectile(
            this.position.x,
            this.position.y,
            this,
            0.05,
            TEAM.ROYALTY
          ));
        } else {
          for (let i = 0; i < this.projectiles; i++) {
            game.actors.push(createProjectile(
              this.position.x + randInRange(-20, 20),
              this.position.y + randInRange(-20, 20),
              this,
              0.05,
              TEAM.ROYALTY
            ));
          }
        }
      }
    }
  }
}

export const createTower = (x: number, y: number, color: HEX, power: number, projectiles: number) => {
  const a = new Tower(x, y, 60, color);
  a.team = TEAM.ROYALTY;
  a.power = power;
  a.maxSpeed = 0.;
  a.range = 100.;
  a.projectiles = projectiles;
  a.attackTargetColorFn = returnFalse;
  return a;
}
