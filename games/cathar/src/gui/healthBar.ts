import { GameObjectClass, Sprite } from "kontra";
import { Character } from "../entities/character";

class HealthBar extends GameObjectClass{
    bar: Sprite
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number, character: Character){
        super({x: x, y: y, width: width, character: character})
        this.width = width;
        this.height = height;
        this.bar = Sprite({width: width, height: height, color: "#aa0000"});
        this.addChild(Sprite({width: width, height: height, color: "#000000"}));
        this.addChild(this.bar);
    }

    update(){
        super.update();
        this.bar.width = this.width * (this.character.health / this.character.maxHealth)
    }
}

export default HealthBar;