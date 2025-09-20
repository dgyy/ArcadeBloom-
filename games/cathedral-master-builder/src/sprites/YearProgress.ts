import {
    Sprite,
    SpriteClass,
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";

export default class YearProgress extends SpriteClass {

    private readonly bar: Sprite;
    private readonly fullWidth: number;

    constructor(x: number, y: number, width: number) {

        super({x: x,
            y: y,
            width: width,
            height: gameOptions.gameHeight * 0.05,
            color: 'white'
        });             // create the background (parent sprite)

        // set the full width (when the bar is full)
        let frameWidth = 0.04;
        this.fullWidth = this.width * (1 - 2 * frameWidth);

        // create the bar background
        const barBackground = Sprite({
            x: this.width * frameWidth,
            y: this.width * frameWidth,
            width: this.fullWidth,
            height: this.height - 2 * (this.width * frameWidth),
            color: '#eddaa8'
        });

        // create the bar
        this.bar = Sprite({
            x: barBackground.x,
            y: barBackground.y,
            width: this.fullWidth,
            height: barBackground.height,
            color: '#8d8d85'
        });

        this.fullWidth = this.bar.width;

        this.addChild(barBackground, this.bar);

    }

    setBar(progress: number) {

        if (progress > 1) {
            progress = 1;
        }
        this.bar.width = this.fullWidth * progress;

    }

}
