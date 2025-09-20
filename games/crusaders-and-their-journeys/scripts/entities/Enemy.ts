import Sprite from "../objects/Sprite";
import { getRandomDirection, getRandomIntInclusive, uuid } from "../utils";
import Civilian from "./Civilian";
import knightSprite from "../../../assets/knight.avif";
import Player from "./Player";
import { IPosition, ISize } from "../objects/GameObject";

export default class Enemy extends Player {
  player: Player;
  civilians: Civilian[] = [];
  infecteds: Civilian[] = [];
  robbers: Civilian[] = [];

  constructor(ctx: CanvasRenderingContext2D, player: Player) {
    super(ctx);
    this.player = player;
  }

  init(): void {
    setTimeout(() => {
      this.spawn();
    }, 5000);
  }

  spawn(): void {
    this.spawnCivilians();
    this.spawnInfectedsOrRobbers(true);
    this.spawnInfectedsOrRobbers(false);
    setInterval(() => {
      if (this.player.crusaders.length) {
        for (let i = 0; i < getRandomIntInclusive(1, 3); i++) {
          const randRobber = this.robbers[getRandomIntInclusive(0, this.robbers.length)];
          if (randRobber) {
            this.attack(randRobber.getPositionCenter(), this.player.getRandomCrusader().getPositionCenter(), 8, "red");
          }
        }
      }
    }, 1000);
  }
  spawnCivilians(): void {
    for (let i = 1; i <= getRandomIntInclusive(2, 4); i++) {
      const sprite = new Sprite(this.ctx, knightSprite, { frameSize: { width: 40, height: 36 }, columns: 1, rows: 12, frameSet: 3, frameIndex: 0 }, "#FFFADD");
      const civilian = new Civilian(this.ctx, sprite, i, getRandomIntInclusive(1, 3));

      civilian.position = this.getRandomUnitPosition(sprite.config.frameSize);

      const moveTo = {
        x: (this.canvas.width / 2) * 2 - civilian.position.x,
        y: (this.canvas.height / 2) * 2 - civilian.position.y,
      };
      if (civilian.position.x > 0) {
        moveTo.x -= sprite.config.frameSize.width * 2;
      }
      if (civilian.position.y > 0) {
        moveTo.y -= sprite.config.frameSize.height * 2;
      }
      civilian.moveTo = moveTo;

      this.civilians.push(civilian);
    }
  }
  getRandomUnitPosition(unitSize: ISize): IPosition {
    let x, y;
    const offset = getRandomIntInclusive(0, 1000);
    if (getRandomDirection() > 0) {
      const directionY = getRandomDirection();
      if (directionY > 0) {
        y = this.canvas.height + offset;
      } else {
        y = -unitSize.height - offset;
      }
      x = getRandomIntInclusive(0, this.canvas.width);
    } else {
      const directionX = getRandomDirection();
      if (directionX > 0) {
        x = this.canvas.width + offset;
      } else {
        x = -unitSize.width - offset;
      }
      y = getRandomIntInclusive(0, this.canvas.height);
    }
    return { x, y };
  }

  spawnInfectedsOrRobbers(isInfecteds: boolean) {
    const color = isInfecteds ? "green" : "red";
    const array = isInfecteds ? this.infecteds : this.robbers;
    for (let i = 1; i <= getRandomIntInclusive(2, 4); i++) {
      const sprite = new Sprite(this.ctx, knightSprite, { frameSize: { width: 40, height: 36 }, columns: 1, rows: 12, frameSet: 3, frameIndex: 0 }, color);
      const unit = new Civilian(this.ctx, sprite, uuid(), getRandomIntInclusive(1, 2));
      unit.position = this.getRandomUnitPosition(sprite.config.frameSize);
      unit.moveTo = this.getRandomPosition(unit.sprite.config.frameSize);
      array.push(unit);
    }
  }
  getRandomPosition(size: ISize): IPosition {
    return {
      x: getRandomIntInclusive(0, this.canvas.width - size.width),
      y: getRandomIntInclusive(0, this.canvas.height - size.height)
    };
  }

  render(tFrame?: number): void {
    super.render(tFrame);
    this.reSpawn();
  }
  draw(): void {
    this.civilians.forEach(unit => unit.draw());
    this.infecteds.forEach(unit => unit.draw());
    this.robbers.forEach(unit => unit.draw());
    this.bulletList.forEach(bullet => {
      bullet.render();
    });
  }
  move(): void {
    this.civilians.forEach(unit => {
      unit.move(this.setNextSpriteFrame);
      if (!unit.moveTo) {
        this.killCivilian(unit.id);
      }
    });

    [...this.infecteds, ...this.robbers].forEach(unit => {
      unit.move(this.setNextSpriteFrame);
      if (!unit.moveTo) {
        unit.moveTo = this.getRandomPosition(unit.sprite.config.frameSize);
        unit.velocity = getRandomIntInclusive(1, 2);
      }
    });
  }

  isNeedReSpawnCivilians: boolean = false;
  isNeedReSpawnInfectedsWithRobbers: boolean = false;
  reSpawn(): void {
    if (!this.isNeedReSpawnCivilians && !this.civilians.length) {
      this.isNeedReSpawnCivilians = true;
      setTimeout(() => {
        this.spawnCivilians();
        this.isNeedReSpawnCivilians = false;
      }, 5000);
    }

    if (!this.isNeedReSpawnInfectedsWithRobbers) {
      this.isNeedReSpawnInfectedsWithRobbers = true;
      setTimeout(() => {
        const rand = getRandomIntInclusive(1, 3);
        switch (rand) {
          case 1:
            this.spawnInfectedsOrRobbers(true);
            break;
          case 2:
            this.spawnInfectedsOrRobbers(false);
            break;
          case 3:
            this.spawnInfectedsOrRobbers(true);
            this.spawnInfectedsOrRobbers(false);
            break;
        }
        this.isNeedReSpawnInfectedsWithRobbers = false;
      }, getRandomIntInclusive(5, 7) * 1000);
    }
  }

  killCivilian(id: number): void {
    this.civilians.splice(this.civilians.findIndex(unit => unit.id === id), 1);
  }
  killInfected(id: number): void {
    this.infecteds.splice(this.infecteds.findIndex(unit => unit.id === id), 1);
  }
  killRobber(id: number): void {
    this.robbers.splice(this.robbers.findIndex(unit => unit.id === id), 1);
  }
}
