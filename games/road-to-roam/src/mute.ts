import { Sprite, track } from 'kontra';
import { GameState } from './gameState';

export function createMute(canvas: HTMLCanvasElement, gameState: GameState, audio: HTMLAudioElement): Sprite {
    let mute = Sprite({
        x: 30,
        y: canvas.height - 30,
        height: 40,
        width: 40,
        anchor: { x: 0.5, y: 0.5 },
        render() {
            this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.moveTo(0, 0);
            this.context.lineTo(0, this.height);
            this.context.lineTo(this.width * 0.6, this.height * 0.6);
            this.context.lineTo(this.width, this.height * 0.6);
            this.context.lineTo(this.width, this.height * 0.4);
            this.context.lineTo(this.width * 0.6, this.height * 0.4);
            this.context.lineTo(0, 0);
            this.context.closePath();
            this.context.fill();

            if (gameState.muted) {
                this.context.strokeStyle = 'red';
                this.context.lineWidth = 3;
                this.context.beginPath();
                this.context.moveTo(this.width * 0.8, this.height + 3);
                this.context.lineTo(this.width * 0.2, -3);
                this.context.stroke();
            }
        },
        onDown() {
            gameState.muted = !gameState.muted;
            if (gameState.muted) {
                audio.pause();
            }
            else {
                let playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                    })
                        .catch(error => {
                        });
                }
            }
        },
    });
    track(mute);
    return mute;
}
