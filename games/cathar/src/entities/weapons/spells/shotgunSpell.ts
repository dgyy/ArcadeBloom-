import {Spell} from "./spell";
import SpellCaster from "./spellCaster";
import {ParticleType} from "./particles/particleTypes";
import {SpellParticle} from "./particles/spellParticle";

class ShotgunSpell extends Spell{
    constructor(spellCaster: SpellCaster, particleType: ParticleType, num: number, spread: number, lifeTime: number)  {
        super(spellCaster, particleType);
        this.lifeTime = lifeTime
        for(let i = 0; i < num; i++){
            const s = Math.floor((i+1)/2) * spread;
            const dir = (i % 2) * 2 - 1
            this.addChild(new SpellParticle(0, 0, particleType, this, undefined, dir * s, num > 20));
        }
    }
}

export default ShotgunSpell;