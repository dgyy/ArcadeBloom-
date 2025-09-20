import {Entity} from "./entity";
import {centeredAnchor} from "../utils/sprite";
import {Player} from "./player";
import {Weapon} from "./weapons/weapon";
import {Reward} from "./reward";
import {getVectorBetweenGameObjects} from "../utils/vectors";
import CatharPerfect from "./npcs/catharPerfect";
import Game from "../game";
import {playSound, POWERUP} from "../utils/sound";
import {GameObject} from "kontra";

class Interactable extends Entity {
    gameObject: GameObject

    constructor(x: number, y: number, gameObject: GameObject) {
        super({x: x, y: y, entity: gameObject, anchor: centeredAnchor});
        this.scaleX = gameObject.scaleX > 1 ? 1 : 4;
        this.scaleY = gameObject.scaleY > 1 ? 1 : 4;
        this.gameObject = gameObject;
        this.addChild(gameObject);
    }

    entityDistanceFrom(player: Player) {
        return getVectorBetweenGameObjects(this.gameObject, player).length();
    }

    interactWith(player: Player) {
        if (this.gameObject instanceof Weapon) {
            player.handWeapon(this.gameObject)
            this.removeFlag = true;
        }
        if (this.gameObject instanceof Reward) {
            playSound(POWERUP)
            player.collectReward(this.gameObject)
            this.removeFlag = true;
            Game.getInstance().startChat([this.gameObject.getText()], false);

        }
        if (this.gameObject instanceof CatharPerfect) {
            this.gameObject.talk();
        }
    }
}

export default Interactable;