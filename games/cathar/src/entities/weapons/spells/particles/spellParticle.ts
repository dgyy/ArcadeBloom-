import {Damageable} from "../../damageable";
import {Spell} from "../spell";
import {Sprite, Vector} from "kontra";
import {centeredAnchor} from "../../../../utils/sprite";
import {Character} from "../../../character";
import {ParticleType} from "./particleTypes";
import {getRotatedVector, getVectorBetweenGameObjects} from "../../../../utils/vectors";

export class SpellParticle extends Damageable {
    spell: Spell;
    lifeTime: number;
    isAttacking = false;
    destroyOnCollision = false;
    width = 1;
    height = 1;
    direction?: Vector;
    rotateDirectionRadiants: number;

    constructor(x: number, y: number, particleType: ParticleType, spell: Spell, direction?: Vector, rotateDirectionRadiants: number = 0, slowDown: boolean = false) {
        super(x, y, Sprite({width: 1, height: 1, color: particleType.color, anchor: centeredAnchor}))
        this.speed = particleType.speed;
        this.standardDamage = particleType.damage;
        this.lifeTime = spell.calculatedCastingTime() + particleType.lifetime;
        this.spell = spell;
        this.owner = spell.owner;
        this.direction = direction;
        this.rotateDirectionRadiants = rotateDirectionRadiants;
        if(slowDown){
            this.currentSpeed = () => {
                return this.speed * (this.lifeTime/120)
            };
        }
    }

    update() {
        super.update();
        if (--this.lifeTime == 0) this.removeFlag = true;
    }

    getDirection = (target?: Character) => target ? getVectorBetweenGameObjects(this, target).normalize() : this.direction ??  Vector(0, 0);

    activate(target?: Character) {
        this.isAttacking = true;
        this.destroyOnCollision = true;
        this.moveTo(getRotatedVector(this.getDirection(target), this.rotateDirectionRadiants), 2000);
    }
}