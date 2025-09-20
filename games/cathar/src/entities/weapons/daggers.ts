import {Vector} from "kontra";
import {Weapon} from "./weapon";
import {getSpriteById} from "../../utils/sprite";
import {PenColor} from "../../utils/colorize";
import {img2} from "../../utils/utils";

export class Dagger extends Weapon {
    stabbingDistance: number = 6;
    holdingDistance: number = 4;
    currentDistance: number = 0;

    speed: number = 0.5;
    returnDagger: boolean = false;
    direction = Vector(1, 0);
    wiggleX: number = 0.6;

    update() {
        super.update();
        this.adjust();

        if (!this.isAttacking) return;

        this.currentDistance += this.returnDagger ? -this.speed : this.speed;
        this.x += this.direction.x * this.currentDistance;
        this.y += this.direction.y * this.currentDistance;

        if (this.currentDistance >= this.stabbingDistance - this.holdingDistance) {
            this.returnDagger = true;
        }

        if (this.currentDistance <= 0) {
            this.isAttacking = false;
            this.returnDagger = false;
        }
    }

    adjust() {
        this.rotation = Vector(0, -1).angle(this.direction) - 0.5 * Math.PI;
        this.x = this.originY + this.direction.x * this.holdingDistance
        this.y = this.originY + this.direction.y * this.holdingDistance
    }

    pointInDirection(direction: Vector) {
        direction.x *= this.owner!.lookingDirection;
        this.direction = direction.normalize();
    }

    getLookingDirection(): number {
        return 0;
    }
}

export class BigDagger extends Dagger {
    constructor() {
        super(0, 2, getSpriteById(6));
        this.width = 4;
        this.height = 2;
        this.standardDamage = 6;
    }
}

export class Sword extends Dagger {
    constructor() {
        super(0, 2, getSpriteById(0, PenColor.None, {}, img2));
        this.width = 5;
        this.height = 1;
        this.holdingDistance = 2;
        this.standardDamage = 6;
    }
}

export class SmallDagger extends Dagger {
    constructor() {
        super(0, 1, getSpriteById(8, PenColor.None, {y: -0.5}));
        this.width = 4;
        this.height = 1;
        this.standardDamage = 3.5;

        this.stabbingDistance = 6;
        this.holdingDistance = 3;
    }
}