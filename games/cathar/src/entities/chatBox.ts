import {GameObjectClass, keyMap, keyPressed, Sprite, Text} from "kontra";
import {getCanvasHeight, getCanvasWidth} from "../utils/utils";
import {Timer} from "./timer";
import Game from "../game";

class ChatBox extends GameObjectClass {
    currentTextId: number = 0;
    text: Text
    canContinue: boolean = false;

    keyPressTimer: Timer = new Timer(25, () => {
        this.canContinue = true;
    })
.start()
    constructor(texts: string[]) {
        super({texts: texts, x: getCanvasWidth() / 2 - 200, y: getCanvasHeight() - 120})
        this.text = Text({
            x: 10,
            y: 10,
            width: 380,
            text: texts[this.currentTextId],
            color: "white",
            font: '18px Verdana'
        })
        this.addChild(
            Sprite({width: 400, height: 80, color: "white"}),
            Sprite({x: 2, y: 2, width: 396, height: 76, color: "black"}),
            this.text
        )
    }

    update() {
        this.keyPressTimer.update();
        if(this.canContinue && keyPressed(["e"])){
            if(this.currentTextId < this.texts.length - 1){
                this.canContinue = false;
                this.keyPressTimer.start();
                this.text.text = this.texts[++this.currentTextId];
            } else {
                Game.getInstance().endChat();
            }
        }
    }
}

export default ChatBox;