import { AABB } from "../aabb";
import { Context } from "../canvas";
import { DEBUG, PROJECTILES } from "../constants";
import { Duration } from "../duration";
import { EXPLOSIONS, createExplosion } from "../explosion";
import { Projectile } from "../projectile";
import { Sounds } from "../sounds";
import { Vector2 } from "../vector";

export enum SoldierRank {
    BASE, UPGRADED, ELITE
}

export enum SoldierType {
    RANGED, MOUNTED, MELEE, GENERIC
}

export type SoldierPalette = {
    main: string;
    accent: string;
    skin: string;
};

export class Soldier {
    public id = Math.random().toString();

    public name = 'Soldier';

    public cost = 1;

    public upgradeCost = 2;

    public healCost = 1;

    public goldValue = 1;

    public type = SoldierType.GENERIC;

    public damaged = 0;
    public maxDamageFrames = 30;

    public meleeAttack = 0;
    public meleeAttackFrames = 30;

    public speed = .25;
    public attack = 1;
    public maxHealth: number;
    public health: number;
    public attackRange = 50;
    public attackRate = new Duration(1000);

    public attackAngle = 0;

    public experience = 0;
    public experienceForEliteStatus = 6;
    public experienceForUpgradedStatus = 3;

    public startPos: Vector2;
    public target: Soldier | undefined;

    public get width(): number {
        return this.bounds.width;
    }

    public get height(): number {
        return this.bounds.height;
    }

    public get pos(): Vector2 {
        return this.bounds.pos;
    }

    public alive = true;


    constructor(public bounds: AABB, public rank = SoldierRank.BASE) {
        this.startPos = bounds.pos.copy();
    }

    public canUpgrade(): boolean {
        if (this.rank === SoldierRank.BASE) {
            return this.experience >= this.experienceForUpgradedStatus;
        }

        if (this.rank === SoldierRank.UPGRADED) {
            return this.experience >= this.experienceForEliteStatus;
        }

        return false;
    }

    public upgrade() {
        if (this.rank === SoldierRank.UPGRADED) {
            this.rank = SoldierRank.ELITE;
        }

        if (this.rank === SoldierRank.BASE) {
            this.rank = SoldierRank.UPGRADED;
        }
    }

    public hasDamage() {
        return this.health < this.maxHealth;
    }

    public update(dt: number, enemies: Soldier[]) {
        if (enemies.length === 0) return;

        if (!this.target) {
            this.target = this.selectTarget(enemies);
        }

        if (this.target && this.pos.distanceFrom(this.target.pos) > this.attackRange) {
            this.pos.moveTowards(this.target.pos, this.speed);
        }

        if (this.attackRate.hasPassed() && this.pos.distanceFrom(this.target.pos) <= this.attackRange) {
            this.performAttack();
        }

        if (this.target.health <= 0) {
            delete this.target;
        }

        if (this.damaged) {
            this.damaged--;
        }

        if (this.meleeAttack) {
            this.meleeAttack--;
        }

        if (this.alive && this.health <= 0) {
            Sounds.playSound(Sounds.death);
            EXPLOSIONS.push(createExplosion(this.pos))
        }

        this.alive = this.health > 0;
    }

    public performAttack() {
        if (this.target) {
            this.attackAngle = Math.atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
            if (this.type === SoldierType.RANGED) {
                PROJECTILES.push(new Projectile(this.id, this.attackAngle, this.pos));
                Sounds.playSound(Sounds.shoot);
            } else {
                this.meleeAttack = this.meleeAttackFrames;
                this.target.health -= this.attack;
                if (this.target.health <= 0) {
                    this.experience += 1;
                }
                this.target.damaged = this.target.maxDamageFrames;
                Sounds.playSound(Sounds.hit);
            }
        }
    }

    public animateMeleeAttack(ctx: Context) {
        if (this.meleeAttack && this.target) {
            ctx.save();
            ctx.fillStyle = 'white';

            const offset = this.meleeAttackFrames - (this.meleeAttack * 2);
            const offsetRadians = offset * (0.0174533 * 2);
            ctx.translate(this.pos.x, this.pos.y);
            if (this.target.pos.x < this.pos.x) {
                ctx.rotate(this.attackAngle - offsetRadians);
            } else {
                ctx.rotate(this.attackAngle + offsetRadians);
            }
            ctx.lineWidth = 2;
            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 0, this.attackRange - this.width, this.width / 3);
            ctx.strokeRect(0, 0, this.attackRange - this.width, this.width / 3);
            ctx.restore();
        }
    }

    public draw(ctx: Context) {
        if (this.damaged > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.width, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, .4)';
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        if (DEBUG) {
            if (this.target) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(this.target.pos.x, this.target.pos.y);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }

            const hitBox = this.getHitBox();
            ctx.strokeRect(hitBox.pos.x, hitBox.pos.y, hitBox.width, hitBox.height);
        }
    }

    public drawHealthBar(ctx: Context) {
        const hitBox = this.getHitBox();
        ctx.save();
        const healthBarHeight = hitBox.height / 6;
        ctx.fillStyle = 'red';
        ctx.fillRect(hitBox.pos.x, hitBox.pos.y - (healthBarHeight * 2), hitBox.width, healthBarHeight);
        ctx.fillStyle = 'green';
        const step = hitBox.width / this.maxHealth;
        const healthWidth = this.health * step;
        ctx.fillRect(hitBox.pos.x, hitBox.pos.y - (healthBarHeight * 2), healthWidth, healthBarHeight);
        ctx.lineWidth = 2;
        ctx.strokeRect(hitBox.pos.x, hitBox.pos.y - (healthBarHeight * 2), hitBox.width, healthBarHeight);
        ctx.restore();
    }

    public isStrongAgainst(soldier: Soldier): boolean {
        switch (this.type) {
            case SoldierType.MELEE:
                return soldier.type === SoldierType.MOUNTED;
            case SoldierType.MOUNTED:
                return soldier.type === SoldierType.RANGED;
            case SoldierType.RANGED:
                return soldier.type === SoldierType.MELEE;
        }

        return false;
    }

    public selectTarget(soldiers: Soldier[]): Soldier {
        const sortedByDistance = this.sortSoldiersByDistance(soldiers);
        const strongAgainst = sortedByDistance
            .filter(_ => this.isStrongAgainst(_));
        if (strongAgainst.length) {
            return strongAgainst[0];
        }
        return sortedByDistance[0];
    }

    public sortSoldiersByDistance(soldiers: Soldier[]): Soldier[] {
        return soldiers.sort((a, b) => a.pos.distanceFrom(this.pos) < b.pos.distanceFrom(this.pos) ? 0 : 1);
    }

    public getHitBox(): AABB {
        return new AABB(this.width * 2, this.height * 2, new Vector2(this.pos.x - this.width, this.pos.y - this.height));
    }

    public collides(soldiers: Soldier[]): boolean {
        return soldiers.some(_ => _.getHitBox().intersects(this.getHitBox()));
    }
}
