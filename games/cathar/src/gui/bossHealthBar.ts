import {Text} from "kontra";
import HealthBar from "./healthBar";
import { Enemy } from "../entities/enemies/enemy";
import { getCanvasCenter, getCanvasWidth } from "../utils/utils";
import { centeredAnchor } from "../utils/sprite";

class BossHealthBar extends HealthBar {
    constructor(y: number, boss: Enemy) {
        super(getCanvasCenter().x -100, y, 200, 4, boss)
        this.addChild(Text({y: -20, text: boss.name, font: '16px Verdana', textAlign: 'center', width: this.width}))
    }
}

export default BossHealthBar;