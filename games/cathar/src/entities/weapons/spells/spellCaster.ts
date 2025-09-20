import {GameObjectClass, randInt, Sprite} from "kontra";
import {Character} from "../../character";
import {Spell} from "./spell";
import Game from "../../../game";
import SpawnSpell from "./spawnSpell";

class SpellCaster extends GameObjectClass{
    constructor(x: number, y: number, owner: Character, spellFactories: any[]) {
        super({x: x, y: y, owner: owner, spellFactories: spellFactories});
    }

    cast(): Spell{
        let spell = undefined;
        while(spell === undefined){
            const s = this.spellFactories[randInt(0, this.spellFactories.length-1)](this).start();
            if(this.owner.room.enemies.length > 4 && s instanceof SpawnSpell){
                continue;
            }
            spell = s;
        }
        Game.getInstance().currentRoom.addSpell(spell);
        return spell;
    }
}

export default SpellCaster