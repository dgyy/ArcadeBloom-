import {GameObjectClass, keyPressed} from "kontra";
import Room from "./rooms/room";
import StartRoom from "./rooms/startRoom";
import IntroRoom from "./rooms/introRoom";
import EndRoom from "./rooms/winRoom";
import ChatBox from "./entities/chatBox";
import {getbgm, playbgm, resumebgm} from "./utils/sound/catharian";
import BattleRoom from "./rooms/battleRoom";
import {Timer} from "./entities/timer";

class Game extends GameObjectClass {
    introRoom: IntroRoom;
    currentRoom!: Room;
    currentChatBox?: ChatBox;
    deaths: number = 0;
    audioBufferSourceNode?: AudioBufferSourceNode
    interactTimeoutTimer: Timer = new Timer(15);
    mute: boolean = false;
    blockChat: boolean = false;

    canToggleMute: boolean = true;
    muteInputTimer: Timer = new Timer(15, () => {
        this.canToggleMute = true;
    })


    public static _game: Game;

    private constructor() {
        super();
        this.bgm = getbgm()
        this.introRoom = new IntroRoom();
        // this.goToStartRoom()
        this.goToRoom(this.introRoom)
    }

    public static getInstance(): Game {
        return Game._game ??= new Game();
    }

    goToStartRoom() {
        this.goToRoom(new StartRoom())
    }

    goToRoom(room: Room) {
        this.blockChat = false;
        this.currentChatBox = undefined;

        if (room instanceof BattleRoom) {
            this.tryToActivateSoundInBattleRoom();
        }else{
            this.tryToMuteSound();
        }
        room.init();
        this.currentRoom = room;
    }

    tryToActivateSoundInBattleRoom(){
        if (!this.mute && !this.audioBufferSourceNode) {
                this.audioBufferSourceNode = playbgm(this.bgm)
            }
        } tryToMuteSound() {
            if (this.audioBufferSourceNode) {
                this.audioBufferSourceNode?.stop();
                this.audioBufferSourceNode = undefined}
    }

    toggleMute(){
        this.mute = !this.mute;

        if(this.mute){
            this.tryToMuteSound()
        }else{
            if(this.currentRoom instanceof BattleRoom){
                this.tryToActivateSoundInBattleRoom();
            }
        }
    }

    startChat(texts: string[], block: boolean = true) {
        if(!this.interactTimeoutTimer.isActive){
            this.blockChat = block;
            this.currentChatBox = new ChatBox(texts)
        }
    }

    endChat() {
        this.blockChat = false;
        this.currentChatBox = undefined;
        this.interactTimeoutTimer.start();
        if (this.currentRoom instanceof EndRoom) {
            this.currentRoom.startEnd();
        }
    }

    update = () => {
        this.updateMuteButton();

        if (this.currentChatBox) {
            this.currentChatBox.update();
        }else{
            this.interactTimeoutTimer.update();
        }

        if(!this.blockChat){
            this.currentRoom.update();
        }


        resumebgm()
    }

    updateMuteButton(){
        this.muteInputTimer.update();
        if(!this.muteInputTimer.isActive && keyPressed("m")){
            this.muteInputTimer.start();
            this.toggleMute();
        }
    }

    render = () => {
        this.currentRoom.render();
        this.currentChatBox?.render();
    }
}

export default Game;