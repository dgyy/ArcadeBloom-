import {
    Text,
    Sprite,
    SpriteClass,
    emit
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import Button from "./Button.ts";

export default class Popup extends SpriteClass {

    public visible: boolean;
    private background: Sprite;
    private shadow: Sprite;
    private text: Text;
    private button: Button;
    private readonly textDistance: number;
    private readonly buttonDistance: number;

    constructor() {

        super({
            x: gameOptions.gameWidth * 0.5,
            y: gameOptions.gameHeight * 0.5,
            width: gameOptions.gameWidth * 0.5,
            height: gameOptions.gameHeight * 0.75
        });             // dummy sprite

        // initialize variables
        this.visible = false;

        // parameters
        let shadowDistance = gameOptions.gameWidth * 0.01;
        this.buttonDistance = gameOptions.gameHeight * 0.03;
        this.textDistance = gameOptions.gameWidth * 0.005;

        // create background
        this.background = Sprite({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            color: '#4A0404'
        });

        // create shadow
        this.shadow = Sprite({
            x: shadowDistance,
            y: shadowDistance,
            width: this.width,
            height: this.height,
            color: 'black',
            opacity: 0.3
        });

        // create text
        this.text = Text({
            x: this.textDistance,
            y: this.textDistance,
            text: '',
            ...gameOptions.fontYearbook,
            color: 'white',
            width: this.width - 2 * this.textDistance
        });

        // add button
        this.button = new Button(
            0,
            0,
            'OK',
            '#8d8d85',
            () => {
                this.clickButton();
            }
        );

        // add all as children
        this.addChild([this.shadow, this.background, this.text, this.button]);

    }

    clickButton() {
        this.visible = false;

        emit('popupClick');
    }

    render() {

        if (this.visible) {
            super.render();
        }

    }

    // show the popup with the text
    show(text: string) {

        this.visible = true;        // make it visible

        // change the text and set the size of the box and place the button
        this.text.text = text;
        this.text.render();         // call text render to update the height!

        this.height = this.text.height + this.textDistance + 2 * this.buttonDistance + this.button.height;
        this.background.height = this.height;
        this.shadow.height = this.height;

        this.x = gameOptions.gameWidth * 0.5 - this.width / 2;
        this.y = gameOptions.gameHeight * 0.5 - this.height / 2;

        this.button.x = this.width / 2 - this.button.width / 2;
        this.button.y = this.text.y + this.text.height + this.buttonDistance;
    }

}

