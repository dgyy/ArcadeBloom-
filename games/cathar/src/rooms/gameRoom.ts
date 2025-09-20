import {Sprite} from "kontra";
import {Player} from "../entities/player";
import PlayerHealthBar from "../gui/playerHealthBar";
import {getCanvasHeight, getCanvasWidth, wallHeight} from "../utils/utils";
import Room from "./room";
import MuteIcon from "../gui/muteIcon";


class GameRoom extends Room {

    constructor() {
        super();
        this.components.player = [Player.getInstance()]
        this.gui.push(new PlayerHealthBar(20, getCanvasHeight() - 30))
        this.gui.push(new MuteIcon(20, 20))
        this.backgroundObjects.push(Sprite({width: getCanvasWidth(), height: wallHeight, color: "#555"}))
    }

    init() {
        Player.getInstance().setRoom(this);
        Player.getInstance().setPos(getCanvasWidth() / 2, getCanvasHeight() * 0.92)
    }
}

export default GameRoom;