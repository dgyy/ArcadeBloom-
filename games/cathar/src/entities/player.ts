import {
    keyMap,
    keyPressed, Text,
    Vector,
} from "kontra";
import {Character} from "./character";
import {mousePosition, mousePressed} from "../utils/mouse";
import {centeredAnchor, getSpriteById} from "../utils/sprite";
import {HOP, playSound, STAB} from "../utils/sound";
import Game from "../game";
import Room from "../rooms/room";
import StartRoom from "../rooms/startRoom";
import {Reward, StatusReward} from "./reward";
import {Sword} from "./weapons/daggers";

export class Player extends Character {
    interactText: Text;

    private static _instance: Player;

    private constructor(x: number, y: number) {
        super(x, y, getSpriteById(4));
        this.interactText = Text({
            x: 1,
            y: -7,
            text: "!",
            color: "red",
            font: "5px Arial",
            textAlign: "center",
            opacity: 0,
            anchor: centeredAnchor
        });
        this.addChild(this.interactText)
        this.sprite.opacity = 0.5
        this.deathTimer.setMax(160)
        this.reset();
    }

    public static getInstance = () => Player._instance ??= new Player(0, 0);

    reset() {
        this.removeFlag = false;
        this.speed = 2.7
        this.armCanRotate = true;
        this.strength = 2;
        this.attackSpeed = 35;
        this.dashTimeout = 60;
        this.dashDistance = 60;
        this.initHealth(25);
        this.rewards = new Map<keyof StatusReward, Reward[]>()
    }

    update() {
        super.update();

        if (this.room instanceof StartRoom) {
            this.sprite.opacity = 0.3
        }

        this.updateInteractables();
        this.updatePlayerMovement();
        if (mousePressed(0) && this.canAttack()) {
            this.attack();
            if (this.weapon !== undefined) playSound(STAB)
        }

        if (this.removeFlag) {
            Game.getInstance().deaths++;
            Game.getInstance().goToStartRoom()
            this.reset();
            this.rotation = 0;
        }
    }

    playHopSound = () => playSound(HOP)

    updatePlayerMovement() {
        if (this.dashing) return;

        const direction: Vector = Vector(0, 0);
        if (keyPressed('w')) direction.y = -1;
        if (keyPressed('a')) direction.x = -1;
        if (keyPressed('d')) direction.x = 1;
        if (keyPressed('s')) direction.y = 1;

        this.moveTo(direction)

        if (keyPressed([keyMap.space, 'space'])) this.dashTo(direction)
    }

    pointDaggerDirection() {
        if (!this.armCanRotate) return super.pointDaggerDirection()
        const mouse = mousePosition();
        return Vector(mouse.x - this.world.x, mouse.y - this.world.y).normalize();
    }

    updateInteractables() {
        this.interactText.opacity = 0;
        this.room?.interactables.forEach(i => {
            if (i.entityDistanceFrom(this) > 30) return;

            this.interactText.opacity = 1;
            if (keyPressed("e")) i.interactWith(this);
        })
    }

    getLookingDirection() {
        if (this.weapon?.isAttacking && !this.armCanRotate) return 0;
        return this.x - mousePosition().x < 0 ? 1 : -1;
    }
}