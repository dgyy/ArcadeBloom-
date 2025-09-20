import {Sprite, Vector} from "kontra";
import {Timer} from "./timer";
import {Entity} from "./entity";
import Room from "../rooms/room";
import {BigDagger, Dagger, Sword} from "./weapons/daggers";
import {playSound, TAKE_DAMAGE} from "../utils/sound";
import {StatusAttributes} from "./status-attributes";
import {HealthReward, MaxHealthReward, Reward, WeaponReward} from "./reward";
import {
    ATTACK_SPEED_REWARD, DASH_DISTANCE_REWARD,
    DASH_TIMEOUT_REWARD,
    MAX_HEALTH_REWARD,
    STRENGTH_REWARD,
    sumRewards
} from "../utils/reward-util";
import {Weapon} from "./weapons/weapon";


export class Character extends Entity implements StatusAttributes {
    sprite: Sprite;

    armCanRotate: boolean = false;
    //internal values
    private _maxHealth: number = 0;
    private _health: number = 0;
    private _strength: number = 1;
    private _attackSpeed: number = 60;
    private _dashTimeout: number = 60;
    private _dashDistance: number = 60;

    dashSpeed: number = 4;
    spawning: boolean = true;
    spawningTimer: Timer = new Timer(60, () => this.spawning = false).start();

    dashing: boolean = false;
    dashRefillTimer: Timer = new Timer();
    invincibleTimer: Timer = new Timer(15);
    deathTimer: Timer = new Timer(120, () => this.removeFlag = true)
    attackTimeoutTimer: Timer = new Timer();
    weapon: Weapon | undefined = undefined;
    inbound: boolean = true;

    rewards: Map<string, Reward[]> = new Map<string, Reward[]>()

    // hopping values
    z: number = 0;
    zDir: number = 1;

    // accessors
    get maxHealth(): number {
        return this._maxHealth + sumRewards(this.rewards, MAX_HEALTH_REWARD)
    }

    set maxHealth(number) {
        this._maxHealth = number
    }

    get health(): number {
        return this._health
    }

    set health(number) {
        if (this.maxHealth < number)
            this._health = this.maxHealth
        else
            this._health = number
    }

    get strength(): number {
        return this._strength + sumRewards(this.rewards, STRENGTH_REWARD)
    }

    set strength(number) {
        this._strength = number
    }

    get attackSpeed(): number {
        return this._attackSpeed - sumRewards(this.rewards, ATTACK_SPEED_REWARD)
    }

    set attackSpeed(number) {
        this._attackSpeed = number
    }

    get dashTimeout(): number {
        return this._dashTimeout - sumRewards(this.rewards, DASH_TIMEOUT_REWARD)
    }

    set dashTimeout(number) {
        this._dashTimeout = number
    }

    get dashDistance(): number {
        return this._dashDistance + sumRewards(this.rewards, DASH_DISTANCE_REWARD)
    }

    set dashDistance(number) {
        this._dashDistance = number
    }

    constructor(x: number, y: number, sprite: Sprite, room?: Room) {
        super({width: 5, height: 8, x: x, y: y, scaleX: 5, scaleY: 5});
        this.sprite = sprite;
        this.sprite.x += 0.5;
        this.room = room
        this.sprite.opacity = 0;
        this.addChild(this.sprite);
    }

    canMove() {
        return super.canMove() && !this.deathTimer.isActive
    }

    collectReward(reward: Reward) {
        if(reward instanceof HealthReward){
            reward.apply(this);
            return;
        }

        if(reward instanceof WeaponReward){
            this.handWeapon(reward.weapon);
            if(reward.weapon instanceof Sword){
                this.attackSpeed = 40;
            }
            else if(reward.weapon instanceof BigDagger){
                this.attackSpeed = 45;
            }
            return;
        }

        if(reward instanceof  MaxHealthReward){
            this.health += 5;
        }

        const name = reward.status.name
        let list = this.rewards.get(name)
        if (!list) {
            list = []
        }
        list.push(reward)
        this.rewards.set(name, list)
    }

    isAlive = () => this.health > 0;

    initHealth(maxHealth: number) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    update() {
        super.update();
        this.updateHopping();

        this.invincibleTimer.update();
        this.dashRefillTimer.update();
        this.attackTimeoutTimer.update();
        this.deathTimer.update();
        this.spawningTimer.update();

        if(this.spawning){
            this.sprite.opacity = this.spawningTimer.time / this.spawningTimer.maxTime;
        }else{
            this.sprite.opacity = this.invincibleTimer.isActive ? 0.5 : 1;
        }

        if (!this.moving && this.dashing) {
            this.dashing = false;
        }

        if (this.weapon instanceof Dagger) {
            this.weapon.pointInDirection(this.pointDaggerDirection())
        }
    }

    updateHopping() {
        if (this.moving && !this.dashing) {
            this.z += 0.25 * this.zDir;
            if (this.z <= 0 || this.z >= 1.5) {
                this.zDir *= -1
                if (this.z <= 0) this.playHopSound();
            }

        } else {
            this.z = 0;
            this.zDir = 1;
        }
        this.sprite.y = -this.z;
    }

    playHopSound = () => {
    };

    pointDaggerDirection() {
        return Vector(this.lookingDirection, 0);
    }

    dashTo(direction: Vector) {
        if (!this.dashing && !this.dashRefillTimer.isActive) {
            this.dashing = true;
            this.dashRefillTimer.start(this.dashTimeout);
            this.moveTo(direction, this.dashDistance);
        }
    }

    currentSpeed = () => this.dashing ? this.speed * this.dashSpeed : this.speed;

    handWeapon(weapon: Weapon) {
        if (this.weapon) this.removeChild(this.weapon);
        this.weapon = weapon;
        this.weapon.setOwner(this);
        this.addChild(weapon);
    }

    attack(target?: Character) {
        this.weapon?.tryToAttack(target);
        this.attackTimeoutTimer.start(this.attackSpeed);
    }

    canAttack() {
        return !this.attackTimeoutTimer.isActive && !this.weapon?.isAttacking;
    }

    takeDamage(damage: number) {
        if (this.isInvincible() || damage == 0 || this.health == 0) return;
        this.invincibleTimer.start();

        this.health = Math.max(0, this.health - damage);
        playSound(TAKE_DAMAGE)
        if (this.health <= 0) this.die();
    }

    isInvincible = () => this.invincibleTimer.isActive || this.dashing || this.spawning;

    die() {
        this.rotation = -0.5 * Math.PI;
        this.weapon && this.removeChild(this.weapon)
        this.weapon = undefined;
        this.deathTimer.start();
    }

    targets(): Character[] {
        return this.room?.enemies ?? []
    }
}