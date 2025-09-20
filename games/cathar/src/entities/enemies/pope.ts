import {getSpriteById} from "../../utils/sprite";
import {Staff} from "../weapons/staffs";
import {Mage} from "./mage";
import ShotgunSpell from "../weapons/spells/shotgunSpell";
import SpellCaster from "../weapons/spells/spellCaster";
import {
    blueParticleType,
    orangeParticleType,
    redParticleType,
    yellowParticleType
} from "../weapons/spells/particles/particleTypes";
import {CircularSpell} from "../weapons/spells/circularSpell";
import SpawnSpell from "../weapons/spells/spawnSpell";
import {Villager} from "./villager";
import BattleRoom from "../../rooms/battleRoom";
import {randInt} from "kontra";
import {PenColor} from "../../utils/colorize";

class Pope extends Mage {
    name: string = "Pope Innocent III"
    speed: number = 2.0
    phase: number = 1;

    constructor(x: number, y: number, room: BattleRoom) {
        super(x, y, room, getSpriteById(1, PenColor.RealRed));
        this.attackTimeoutTimer.setMax(80);
        this.seeDistance = 9999;
        this.handWeapon(new Staff([
            (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, blueParticleType, 6, 0.1, 300),
            (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, orangeParticleType, 4, 0.3, 300),
            (spellCaster: SpellCaster) => new CircularSpell(spellCaster, yellowParticleType, 10, 10, 7),
        ]))
        this.initHealth(850)
        this.healthBar.opacity = 0;
    }

    update(){
        super.update()
        if(this.health <= this.maxHealth / 2 && this.phase == 1){
            this.phase = 2;
            this.speed = 2.3;
            this.attackTimeoutTimer.setMax(60);
            this.removeChild(this.sprite);
            this.sprite = getSpriteById(1, PenColor.RealPurple)
            this.addChild(this.sprite);
            this.handWeapon(new Staff([
                (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, blueParticleType, 10, 0.15, 300),
                (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, orangeParticleType, 7, 0.5, 300),
                (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, redParticleType, 30, 0.5, 190),
                (spellCaster: SpellCaster) => new CircularSpell(spellCaster, yellowParticleType, 20, 30, 4),
                (spellCaster: SpellCaster) => {
                    return new SpawnSpell(spellCaster, this.room!, () => {
                        const i = randInt(0, 1);
                        if(i == 1){
                           return  new Villager(0, 0, this.room as BattleRoom);
                        }else{
                            return  new Mage(0, 0, this.room as BattleRoom);
                        }
                    });
                }
            ]))
            this.room?.deleteSpells();
        }
    }

    die(){
        super.die();
        this.room?.deleteEnemies();
    }

    inAttackRange = () => true;
}

export default Pope;