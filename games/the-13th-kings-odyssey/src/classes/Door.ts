import { Animations, Box } from "@/model/common.model";
import { GameObject } from "@/classes/GameObject";
import { drawEngine } from "@/core/draw-engine";
import { DEBUGGER, DOOR_ANIMATION_NAME } from "@/constants/game-conts";
import { Player } from "@/classes/Player";

export class Door extends GameObject {

    // public position: DOMPoint;
    protected height: number = 20;
    protected width: number = 20;
    public static isDoorCollided = false;
    // protected collisionBlocks: Array<CollisionBlock> | undefined = [];
    // public hitBox: Box = new Box();

    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean | undefined) {
        super(position, src, player, animations, loop);
        this.name = 'door'
        this.hitBox.position.x = this.position.x + 14;
        this.hitBox.position.y = this.position.y + 15;
        this.hitBox.width = 5;
        this.hitBox.height = 16;
    }
    gett() {
        this.name = ''
    }

    update() {
        if (DEBUGGER) {
            drawEngine.context.strokeStyle = 'Green';
            drawEngine.context.lineWidth = 1;
            drawEngine.context.beginPath();
            drawEngine.context.rect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
            drawEngine.context.stroke();
        }
        
        Door.isDoorCollided = this.checkCollision();

        if (Door.isDoorCollided) {
            // console.log('door door')
            this.loop = true;
            this.playAnimation(DOOR_ANIMATION_NAME.DOOR_EFFECT);
        } else {
            this.loop = false;
        }
    }
}