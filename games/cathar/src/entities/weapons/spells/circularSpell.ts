import {Spell} from "./spell";
import {Vector} from "kontra";
import {SpellParticle} from "./particles/spellParticle";
import SpellCaster from "./spellCaster";
import {ParticleType} from "./particles/particleTypes";
import {getRotatedVector} from "../../../utils/vectors";

export class CircularSpell extends Spell {
    timer: number = 0;

    distance: number;
    numParticles: number;
    spawnSpeed: number;
    lifeTime: number = 250;

    constructor(spellCaster: SpellCaster, particleType: ParticleType, distance: number, numParticles: number, spawnSpeed: number) {
        super(spellCaster, particleType);
        this.distance = distance;
        this.numParticles = numParticles;
        this.spawnSpeed = spawnSpeed;
    }

    calculatedCastingTime = () => this.numParticles * this.spawnSpeed;

    getCastTimeout = () => this.calculatedCastingTime() * 3

    castingUpdate() {
        super.castingUpdate();
        if (this.timer % this.spawnSpeed == 0) {
            const radiant = 2 * Math.PI * (this.timer / (this.spawnSpeed * this.numParticles));
            const direction = getRotatedVector(Vector(1, 0), radiant);
            this.addChild(new SpellParticle(direction.x * this.distance, direction.y * this.distance, this.particleType, this));
        }
        this.timer++;
    }

    getRotatedDirection(radiant: number) {
        return Vector(Math.cos(radiant), Math.sin(radiant))
    }
}