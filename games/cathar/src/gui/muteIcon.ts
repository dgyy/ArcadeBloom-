import {GameObjectClass, Sprite} from "kontra";
import {getSpriteById} from "../utils/sprite";
import Game from "../game";

class MuteIcon extends GameObjectClass{
    sprite: Sprite;
    constructor(x: number, y: number) {
        super({x: x, y: y});
        this.setScale(3, 3);
        this.sprite = getSpriteById(5)
        this.addChild(this.sprite)
    }

    update(){
        if(Game.getInstance().mute){
            this.sprite.opacity = 0.4;
        }else{
            this.sprite.opacity = 1;
        }
    }
}

export default MuteIcon