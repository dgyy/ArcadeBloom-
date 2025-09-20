import { Animations, Box } from "@/model/common.model";
import { GameObject } from "@/classes/GameObject";
import { CollisionBlock } from "./CollisionBlock";
import { drawEngine } from "@/core/draw-engine";
import { DEBUGGER } from "@/constants/game-conts";
import { Player } from "@/classes/Player";
import { debugBox } from "@/core/utils";

export class Hazard extends GameObject {

    // public position: DOMPoint;
    protected height: number = 10;
    protected width: number = 16;
    public static isHazardCollided = false;
    // protected collisionBlocks: Array<CollisionBlock> | undefined = [];
    // public hitBox: Box = new Box();

    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean | undefined) {
        super(position, src, player, animations, loop);
        this.name = 'hazard'
        this.hitBox.position.x = this.position.x + 3;
        this.hitBox.position.y = this.position.y + 11;
        this.hitBox.width = 9;
        this.hitBox.height = 5;
    }

    update() {
        if (DEBUGGER) {
            // Hit Box
            debugBox(this.hitBox, 'red');
            debugBox(this, 'blue');
        }

        if (!Hazard.isHazardCollided && this.player.isAlive) {
            Hazard.isHazardCollided = this.checkCollision();
        } else if (!this.player.isAlive) {
            Hazard.isHazardCollided = false;
        }
        
        if (Hazard.isHazardCollided) {
            // console.log('player can die here');
            
        } else {
            // console.log('player is safe');
        }
    }
}