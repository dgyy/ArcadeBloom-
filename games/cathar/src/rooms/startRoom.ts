import {Text} from "kontra";
import {SmallDagger} from "../entities/weapons/daggers";
import Interactable from "../entities/interactable";
import {getCanvasCenter, getCanvasHeight, getCanvasWidth} from "../utils/utils";
import Teleporter from "../entities/teleporter";
import BattleRoom from "./battleRoom";
import {getRewards} from "../utils/reward-util";
import GameRoom from "./gameRoom";
import CatharPerfect from "../entities/npcs/catharPerfect";
import RewardDisplay from "../gui/reward-display";

class StartRoom extends GameRoom {
    constructor() {
        super();
        this.addInteractable(new Interactable(getCanvasCenter().x, getCanvasCenter().y, new SmallDagger()))
        this.backgroundObjects.push(new Teleporter(getCanvasWidth() / 2, new BattleRoom(getRewards(-1, 1)[0])));
        this.backgroundObjects.push(Text({x: 12, y: 72, text: "Move: WASD\n\nAttack: Leftclick\n\nDash: Space\n\nInteract: e\n\nMute: m", font: '15px Arial', color: "white"}))
        this.interactables.push(new Interactable(getCanvasWidth() / 2.5, getCanvasHeight() / 4, new CatharPerfect(0, 0, this)))

        this.gui.push(new RewardDisplay(this.components.player[0]))

    }
}


export default StartRoom;