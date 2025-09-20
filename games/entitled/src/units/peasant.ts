import { Game } from '../core/game';
import { RED, isGray } from '../core/resources';
import { getId } from './id';
import { TEAM, Unit } from './unit';

export const PEASANT = getId();
const { cos, sin } = Math;

export class Peasant extends Unit {
  static TYPE = PEASANT;

  update(dt, game: Game) {
    let inRange: Unit;

    this.shotTime += dt;

    if (this.team === TEAM.PEASANT) {
      inRange = game.getOneInRange(this, TEAM.ROYALTY);
    } else {
      inRange = game.getOneInRange(this, TEAM.PEASANT);
    }

    if (inRange) {
      this.target = inRange;
    } else if (!this.target) {
      this.target = game.royalty;
    }

    if (this.target && !this.target.isRemovable) {
      this.angle = this.position.angleXY(this.target.position);
    }

    const { ground } = game;
    const newX = this.position.x + this.maxSpeed * cos(this.angle) * dt;
    const newY = this.position.y + this.maxSpeed * sin(this.angle) * dt;

    let newIndex = ground.toIndex(newX, newY);

    if (this.attackTargetColorFn(ground.getGroundColorAt(newIndex))) {
      this.attack(game, newIndex);
    } else {
      newIndex = ground.toIndex(newX + this.width, newY);

      if (this.attackTargetColorFn(ground.getGroundColorAt(newIndex))) {
        this.attack(game, newIndex);
      } else {
        newIndex = ground.toIndex(newX, newY + this.width);

        if (this.attackTargetColorFn(ground.getGroundColorAt(newIndex))) {
          this.attack(game, newIndex);
        } else {
          newIndex = ground.toIndex(newX + this.width, newY + this.width);

          if (this.attackTargetColorFn(ground.getGroundColorAt(newIndex))) {
            this.attack(game, newIndex);
          } else {
            this.position.x = newX;
            this.position.y = newY;

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
        }
      }
    }
  }

  attack(game: Game, index: number) {
    let targetTEAM = TEAM.PEASANT;

    if (this.team === TEAM.PEASANT) {
      game.ground.damage(this.power, this.width, index);
      targetTEAM = TEAM.ROYALTY;
    }

    if (this.shotTime > this.reloadTime) {
      const target = game.getOneInRange(this, targetTEAM);

      if (target) {
        this.shotTime = 0;
        target.damage(this);
      }
    }
  }
}

export const createPeasant = (x: number, y: number): Peasant => {
  const a = new Peasant(x, y, 40, 0xffff0000);
  a.width = 10;
  a.maxSpeed = 0.05;
  a.reloadTime = Infinity;
  a.health = 10;
  a.attackTargetColorFn = isGray;
  return a;
}
