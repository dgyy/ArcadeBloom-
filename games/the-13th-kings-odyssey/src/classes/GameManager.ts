import { Player } from "@/classes/Player";
import { CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_ANIMATION_NAME } from "@/constants/game-conts";
import { controls } from "@/core/controls";
import { drawEngine } from "@/core/draw-engine";

class GameManager {
    private isStartSelected = true;
    private isGameStarts = false;
    private isPause = false;
    
    constructor() {

    }

    public startGameMenu(player: Player) {
        if (!this.isGameStarts) {
            player.inputOff = true;
            player.switchSprite(PLAYER_ANIMATION_NAME.IDLE);
            player.velocity.x = 0;
            // player.velocity.y = 0;
            if (this.isPause) {
                this.gamePause();
            } else {
                this.titleScreen();
            }
            this.updateControls();
        } else if (this.isGameStarts) {
            if (controls.isConfirm && !controls.previousState.isConfirm) {
                this.isGameStarts = false;
                this.isPause = true;
                // return false;
            } else {
                //TODO: GAME PLAY GOSE HERE.
                this.isPause = false;
                player.inputOff = false;
            }
        }
    }

    private updateControls() {
        if ((controls.isUp && !controls.previousState.isUp)
            || (controls.isDown && !controls.previousState.isDown)) {
            this.isStartSelected = !this.isStartSelected;
        }

        if (controls.isConfirm && !controls.previousState.isConfirm) {
            if (this.isStartSelected) {
                this.isGameStarts = true;
            } else {
                this.toggleFullscreen();
            }
        }
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    public titleScreen() {
        const xCenter = drawEngine.context.canvas.width / 2;

        drawEngine.drawText(`The 13th King's Odyssey`, 25, xCenter, 100, '#ffcc00');
        drawEngine.drawText('Start Game', 22, xCenter, 135, this.isStartSelected ? 'white' : 'gray');
        drawEngine.drawText('Toggle Fullscreen', 22, xCenter, 167, this.isStartSelected ? 'gray' : 'white');
    }

    public gamePause() {
        const xCenter = drawEngine.context.canvas.width / 2;

        drawEngine.drawText('Resume', 20, xCenter, 130, this.isStartSelected ? 'white' : 'gray');
        drawEngine.drawText('Toggle Fullscreen', 20, xCenter, 160, this.isStartSelected ? 'gray' : 'white');
        if (Player.ItemCollectedCount && Player.ItemCollectedCount > 0) drawEngine.drawText('Cups: ' + Player.ItemCollectedCount, 18, xCenter, 190,'yellow');
        if (Player.TotalDeathCounter && Player.TotalDeathCounter > 0) drawEngine.drawText('Deaths: ' + Player.TotalDeathCounter, 18, xCenter, 210,'yellow');
    }

    public gameOver() {

    }

    public gameFinished() {
        const xCenter = drawEngine.context.canvas.width / 2;
        drawEngine.drawText('Thanks you for Playing', 25, xCenter, 130, '#ffcc00');
        drawEngine.drawText('Created By: Himanshu Bisht', 25, xCenter, 160, 'white');
    }
}

export const gameManager = new GameManager();