import {Spell} from "./spell";
import SpellCaster from "./spellCaster";
import {spawnParticleType} from "./particles/particleTypes";
import {SpellParticle} from "./particles/spellParticle";
import {Vector} from "kontra";
import Room from "../../../rooms/room";
import {Enemy} from "../../enemies/enemy";

class SpawnSpell extends Spell{
    constructor(spellCaster: SpellCaster, room: Room, getEnemy: () => Enemy)  {
        super(spellCaster, spawnParticleType);

        this.addChild(new SpellParticle(0, 0, this.particleType, this, Vector(0, 0)));

        this.onRemove = () => {
            const enemy = getEnemy();
            enemy.setPos(this.x, this.y)
            room.components.enemies.push(enemy)
            this.castTime = 110;
        };
    }
}

export default SpawnSpell;