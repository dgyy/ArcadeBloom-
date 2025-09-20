import Room from "./room";
import {Text} from "kontra";
import {centeredAnchor} from "../utils/sprite";
import {getCanvasCenter} from "../utils/utils";
import {Timer} from "../entities/timer";
import Game from "../game";

class IntroRoom extends Room{
    text: Text
    texts: string[] = [
        "Toulouse 1233, Year of Inquisition",
        "By the order of Pope Innocent III, all Cathars must die.",
        "Their belief in two gods,",
        "A cruel god of the old testament",
        "And a benevolent god of the new testament",
        "Is considered heresy.",
        "Your life as a Cathar",
        "Was just taken."
    ]
    textId: number = 0

    fadeInTimer: Timer = new Timer(140, () => this.fateOutTimer.start()).start()

    fateOutTimer: Timer = new Timer(60, () => {
        if(!this.isShowingLastText()){
            this.fadeInTimer.start();
            this.text.text = this.texts[++this.textId]
        }else{
            Game.getInstance().goToStartRoom()
        }
    })

    constructor() {
        super();
        this.text = Text({opacity:0, x: getCanvasCenter().x, y: getCanvasCenter().y, text: this.texts[this.textId], color: "white", font: "20px Arial", textAlign: "center", anchor: centeredAnchor});
        this.backgroundObjects.push(this.text);
    }

    update(){
        super.update();
        this.fadeInTimer.update();
        this.fateOutTimer.update();

        if(this.fadeInTimer.isActive){
            this.text.opacity = Math.min(1, this.text.opacity + 0.015)
        }
        if(this.fateOutTimer.isActive){
            this.text.opacity = Math.min(1, this.text.opacity - 0.035)
        }
    }

    isShowingLastText = () => this.textId == this.texts.length-1
}

export default IntroRoom;