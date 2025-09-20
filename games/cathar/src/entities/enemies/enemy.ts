import {Character} from "../character";
import {Player} from "../player";
import {Sprite, Vector} from "kontra";
import {Timer} from "../timer";
import {getRandomVecDir, randNumber} from "../../utils/utils";
import {centeredAnchor} from "../../utils/sprite";
import BattleRoom from "../../rooms/battleRoom";

export class Enemy extends Character {
    healthBar: Sprite;
    healthBarWidth: number = 6;
    seeDistance: number = 100;
    aggro: boolean = false;
    attackDistance: number = 60;
    name: string = "";

    idleTimer = new Timer(randNumber(200), () => {
        this.moveTo(getRandomVecDir(), randNumber(60));
    }, true).start();

    loadAttackTimer = new Timer(40, () => this.attack(Player.getInstance()));

    constructor(x: number, y: number, sprite: Sprite, room: BattleRoom) {
        super(x, y, sprite, room);
        this.healthBar = Sprite({anchor: centeredAnchor, y: -5, height: 1, color: "#ff000099"})
        this.addChild(this.healthBar)
    }

    update() {
        super.update();
        if(this.dashing || this.spawning) return;

        if (this.aggro) this.updateAggro();
        else this.updateIdle();
    }

    updateAggro() {
        this.loadAttackTimer.update();

        if(this.inAttackRange() && this.canAttack() && !this.loadAttackTimer.isActive) {
            this.initAttack();
        }

        if (this.distanceToPlayer() <= this.seeDistance) {
            this.moveToPlayer();
        }

        if (this.canIdle()) {
            this.loadAttackTimer.stop();
            this.idleTimer.start(randNumber(200));
            this.aggro = false;
        }
    }

    initAttack(){
        this.loadAttackTimer.start();
        this.weapon?.startWiggle();
    }

    inAttackRange = () => this.distanceToPlayer() <= this.attackDistance;

    canIdle = () => this.distanceToPlayer() >= this.seeDistance && !this.moving && !this.loadAttackTimer.isActive;

    updateIdle() {
        this.idleTimer.update();
        if (this.distanceToPlayer() <= this.seeDistance) {
            this.aggro = true;
        }
    }

    distanceToPlayer = () => this.distanceTo(Player.getInstance());

    targets(): Character[] {
        return [Player.getInstance()]
    }

    moveToPlayer() {
        this.movingTo = Vector(Player.getInstance().x - this.playerDirection() * 38, Player.getInstance().y)
    }

    dashToPlayer(){
        this.dashTo(this.vectorTo(Player.getInstance().x, Player.getInstance().y));
    }

    playerDirection() {
        return Math.sign(Player.getInstance().x - this.x);
    }

    getLookingDirection() {
        if(this.health == 0) return 1;
        return this.aggro ? this.playerDirection() : super.getLookingDirection();
    }

    takeDamage(damage: number) {
        super.takeDamage(damage);
        this.healthBar.width = (this.health / this.maxHealth) * this.healthBarWidth;
    }

    pointDaggerDirection() {
        if (!this.armCanRotate || !this.aggro) return super.pointDaggerDirection()
        return Vector(Player.getInstance().world.x - this.world.x, Player.getInstance().world.y - this.world.y).normalize();
    }
}