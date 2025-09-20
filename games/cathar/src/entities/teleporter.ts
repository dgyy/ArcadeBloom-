import {collides, GameObject, GameObjectClass, Sprite} from "kontra";
import Room from "../rooms/room";
import {Reward} from "./reward";
import {centeredAnchor} from "../utils/sprite";
import {wallHeight} from "../utils/utils";
import {Player} from "./player";
import BattleRoom from "../rooms/battleRoom";
import Game from "../game";

class Teleporter extends GameObjectClass{
    constructor(x: number, toRoom: Room) {
        super({toRoom: toRoom, x: x, y: wallHeight, anchor: centeredAnchor, width: 80, height: 4});
        this.addChild(Sprite({width: 80, height: 4, color: "white", anchor: centeredAnchor}));

        if(toRoom instanceof BattleRoom && toRoom.reward){
            const go = GameObject({y: -24, scaleX: 3, scaleY: 3, opacity: 0.7, anchor: centeredAnchor})
            go.addChild(toRoom.reward)
            this.addChild(go);
        }
    }

    update(){
        super.update();
        if(collides(this, Player.getInstance())){
            Game.getInstance().goToRoom(this.toRoom)
        }
    }
}

export default Teleporter;