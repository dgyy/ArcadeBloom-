import {Enemy} from "./enemy";
import {levelToColor, randNumber} from "../../utils/utils";
import {getSpriteById} from "../../utils/sprite";
import {BigDagger, SmallDagger} from "../weapons/daggers";
import BattleRoom from "../../rooms/battleRoom";

export class Villager extends Enemy {
    constructor(x: number, y: number, room: BattleRoom) {
        super(x, y, getSpriteById(0, levelToColor(room.level)), room);
        const lvl = room.level;

        this.strength = 0.5 + lvl * 0.3
        this.speed = randNumber(2 + Math.min(7, lvl) * 0.18);
        this.seeDistance = 100 + Math.min(10, lvl) * 12;
        this.attackTimeoutTimer.setMax(100 - Math.min(7, lvl) * 6);
        this.initHealth(6 + lvl * 9 + (lvl > 6 ? 15 : 0));
        this.armCanRotate = lvl >= 4;

        const weapon = lvl > 6 ? new BigDagger() : new SmallDagger();
        weapon.holdingDistance = 3 + Math.min(5, lvl) * 0.2
        weapon.stabbingDistance = 6 + Math.min(5, lvl) * 0.3
        weapon.speed = 0.5 + lvl * 0.05

        this.dashSpeed = 3;
        this.dashDistance = 40 + lvl * 2;
        this.dashTimeout = 120 - lvl * 2;
        this.handWeapon(weapon)
    }

    updateAggro(){
        super.updateAggro();
        if((this.room as BattleRoom).level > 8 && this.distanceToPlayer() <= this.seeDistance && this.distanceToPlayer() >= 0.5 * this.seeDistance){
            this.dashToPlayer();
        }
    }
}