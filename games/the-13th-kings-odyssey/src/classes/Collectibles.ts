import { Animations, Box } from "@/model/common.model";
import { GameObject } from "@/classes/GameObject";
import { DEBUGGER } from "@/constants/game-conts";
import { Player } from "@/classes/Player";
import { debugBox } from "@/core/utils";

export class Collectibles extends GameObject {

    // public position: DOMPoint;
    // protected height: number = 16;
    // protected width: number = 16;
    public static isCollectiblesCollided = false;
    // protected collisionBlocks: Array<CollisionBlock> | undefined = [];
    // public hitBox: Box = new Box();
    public velocity: DOMPoint;
    
    private xHopVal: number;
    private yHopVal: number;

    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean | undefined) {
        super(position, src, player, animations, loop);
        this.name = 'collectibles_'
        this.hitBox.position.x = this.position.x;
        this.hitBox.position.y = this.position.y;
        this.hitBox.width = 16;
        this.hitBox.height = 16;
        this.velocity = new DOMPoint();
        
        this.xHopVal = Math.random() * Math.PI * 2;
        this.yHopVal = this.xHopVal * 2;
    }

    x = 0;
    y=0;
    update() {
        this.position.y += this.velocity.y;
        if (DEBUGGER) {
            // Hit Box
            debugBox(this.hitBox, 'green');
        }

        this.loop = true;
        
        if (!Collectibles.isCollectiblesCollided && this.player.isAlive) {
            Collectibles.isCollectiblesCollided = this.checkCollision();
        } else if (!this.player.isAlive) {
            Collectibles.isCollectiblesCollided = false;
        }
        
        if (!Collectibles.isCollectiblesCollided) {
            this.orbHop();

        } else {
        }
    }

    private orbHop() {
        this.xHopVal += 0;
        this.yHopVal += .1;
        this.position.y = this.position.y + Math.sin(this.yHopVal) * .1;
    }
}