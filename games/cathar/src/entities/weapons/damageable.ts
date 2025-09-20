import {Entity} from "../entity";
import {Sprite} from "kontra";
import {Character} from "../character";
import {centeredAnchor} from "../../utils/sprite";
import {collidesWithRotation} from "../../utils/sat-collision";

export class Damageable extends Entity {
    isAttacking: boolean = false;
    standardDamage: number = 0;
    sprite: Sprite;
    owner!: Character;
    destroyOnCollision: boolean = false;
    target?: Character;

    constructor(x: number, y: number, sprite: Sprite) {
        super({x: x, y: y, anchor: centeredAnchor});
        this.sprite = sprite;
        this.addChild(this.sprite);
    }

    update() {
        super.update();
        this.checkForHit();
    }

    damage = () => this.standardDamage * this.owner.strength;

    checkForHit() {
        if (!this.isAttacking) return;
        this.owner.targets().forEach(target => {
            if (target.dashing) return;
            if (collidesWithRotation(this, target)) {
                target.takeDamage(this.damage())
                this.removeFlag = this.destroyOnCollision;
            }
        });
    }
}