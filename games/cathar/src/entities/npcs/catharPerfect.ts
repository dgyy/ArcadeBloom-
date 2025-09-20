import {Character} from "../character";
import Room from "../../rooms/room";
import {getSpriteById} from "../../utils/sprite";
import {Player} from "../player";
import WinRoom from "../../rooms/winRoom";
import Game from "../../game";
import {PenColor} from "../../utils/colorize";

class CatharPerfect extends Character{
    startMonologs: string[][] = [
        [
        "Fellow Cathar, meet me, a Cathar Perfect.",
        "It seems like you were slaughtered in the crusade.",
        "Without a consolamentum you are forced to be reborn in this world.",
        "Walk through the door next to me and re-enter this war.",
        "Otherwise, you may never receive salvation",
        ],
        [
            "Both gods will grant you their help.",
            "Choose wisely what help you accept.",
        ]
    ]

    endMonolog: string[] = [
        "Seeing the pope die, all catholic soldiers fled Toulouse.",
        "With the might bestowed upon me as Cathar Perfect",
        "We will hold your consolamentum far before your death.",
        "May you achieve your deserved salvation as our holy warrior."
    ]

    constructor(x: number, y: number, room?: Room) {
        super(x, y, getSpriteById(3, PenColor.Blue), room);
        this.inbound = false;
        this.spawning = false;
    }

    talk(){
        if(this.room instanceof WinRoom){
            Game.getInstance().startChat(this.endMonolog)
        }else{
            Game.getInstance().startChat(this.startMonologs[Math.min(1, Game.getInstance().deaths)])
        }
    }

    getLookingDirection(): number {
        return Math.sign(Player.getInstance().x - this.world.x);
    }
}

export default CatharPerfect;