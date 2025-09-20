import {Enemy} from "./enemy";
import {levelToColor, randNumber} from "../../utils/utils";
import {getSpriteById} from "../../utils/sprite";
import {Staff} from "../weapons/staffs";
import {Sprite} from "kontra";
import SpellCaster from "../weapons/spells/spellCaster";
import ShotgunSpell from "../weapons/spells/shotgunSpell";
import {
    yellowParticleType,
    blueParticleType,
    orangeParticleType,
    redParticleType
} from "../weapons/spells/particles/particleTypes";
import {CircularSpell} from "../weapons/spells/circularSpell";
import {Player} from "../player";
import BattleRoom from "../../rooms/battleRoom";

export class Mage extends Enemy {
    rangeToPlayer: number

    constructor(x: number, y: number, room: BattleRoom, sprite?: Sprite) {
        super(x, y, sprite ?? getSpriteById(2, levelToColor(room.level)), room);
        const lvl = room.level;

        this.speed = randNumber(1.0 + lvl * 0.05);
        this.seeDistance = 240 + lvl * 8;
        this.rangeToPlayer = this.seeDistance * 0.6;
        this.attackDistance = this.rangeToPlayer + 5
        this.attackTimeoutTimer.setMax(100 - lvl * 5);

        this.initHealth(10 + lvl * 4);

        const spellFactories = [
            (spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, orangeParticleType, Math.min(8, lvl), 0.06, 800),
        ]

        if(lvl > 3){
            const particle = lvl > 7 ? yellowParticleType : blueParticleType;
            spellFactories.push( (spellCaster: SpellCaster) => new CircularSpell(spellCaster, particle, 1 + lvl, 3 + lvl, Math.max(8, 15 - lvl)))
        }

        if(lvl > 5){
            const particle = lvl > 9 ? redParticleType : blueParticleType;
            spellFactories.push((spellCaster: SpellCaster) => new ShotgunSpell(spellCaster, particle, 30, 0.3, 120))
        }

        this.handWeapon(new Staff(spellFactories))
    }

    canMove(){
        return super.canMove() && ((this.room as BattleRoom).level > 7 || !(this.weapon as Staff).isCasting());
    }

    inAttackRange = () => this.distanceToPlayer() <= this.attackDistance && this.distanceToPlayer() >= this.attackDistance * 0.5;

    moveToPlayer() {
        const v = this.vectorTo(Player.getInstance().x, Player.getInstance().y)
        const distance = v.length() - this.rangeToPlayer
        if (Math.abs(distance) > 12) this.moveTo(v, distance)
    }
}