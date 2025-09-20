import {
    Text,
    Sprite,
    SpriteClass,
    Grid,
    emit
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import Button from "../sprites/Button.ts";
//import Line from "./Line.ts"

export default class WorkerTile extends SpriteClass {

    private readonly shadow: Sprite;
    private readonly background: Sprite;
    public name: Text;
    public picture: Text;
    public job: Text;
    public age: Text;
    public wage: Text;
    private readonly characteristics: Grid;
    public reputation: Text;
    private hireFireButton: Button;
    private hireFireButtonVisible: boolean;
    private readonly tilePosition: number;                   // number on which position the worker tile is placed

    constructor(x: number, tilePosition: number) {

        super({x: x,
            y: gameOptions.gameHeight * 0.12,
            width: gameOptions.gameWidth * 0.17,
            height: gameOptions.gameHeight * 0.85,
            color: '#eddaa8'
        });             // create the background (parent sprite)

        // initialize variables
        this.hireFireButtonVisible = false;
        this.tilePosition = tilePosition;

        // parameters
        let shadowDistance = gameOptions.gameWidth * 0.008;      // distance of the shadow
        let yDistances = [
            gameOptions.gameHeight * 0.02,                                      // background to name
            gameOptions.gameHeight * 0.05,         // title to picture
            gameOptions.gameHeight * 0.02,         // background to hire / fire button
            gameOptions.gameHeight * 0.01,         // row gap between job age and wage
        ];

        let xDistances = [
            gameOptions.gameWidth * 0.01,        // text from left and right border
        ];

        // create title
        this.name = Text({
            x: this.width / 2,
            y: yDistances[0],
            text: '',
            ...gameOptions.fontSubtitles,
            color: 'black',
            anchor: {x: 0.5, y: 0}
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

        // create background (the same as the parent but it needs to be drawn again after the shadow)
        this.background = Sprite({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            color: this.color
        });

        // create picture
        this.picture = Text({
            x: this.width / 2,
            y: this.name.y + this.name.height + yDistances[1],
            text: '',
            ...gameOptions.fontTitlePictures,
            anchor: {x: 0.5, y: 0}
        });

        // create job text
        this.job = Text({
            text: '',
            ...gameOptions.fontYearbook
        });

        // create age text
        this.age = Text({
            text: '',
            ...gameOptions.fontYearbook
        });

        // create age text
        this.wage = Text({
            text: '',
            ...gameOptions.fontYearbook
        });

        // create the characteristics titles
        let characteristicsTitle = Grid({
            x: xDistances[0],
            y: this.picture.y + this.picture.height + yDistances[1] / 2,
            justify: 'start',
            children: [
                Text({text: 'Job:', ...gameOptions.fontYearbook}),
                Text({text: 'Age:', ...gameOptions.fontYearbook}),
                Text({text: 'Wage:', ...gameOptions.fontYearbook})
            ],
            rowGap: yDistances[3]
        });

        // create the characteristics
        this.characteristics = Grid({
            x: this.width - xDistances[0],
            y: characteristicsTitle.y,
            justify: 'end',
            anchor: {x: 1, y: 0},
            children: [this.job, this.age, this.wage],
            rowGap: characteristicsTitle.rowGap
        });

        // create the reputation title
        let reputationTitle = Text({
            x: characteristicsTitle.x,
            y: characteristicsTitle.y + characteristicsTitle.height + yDistances[1] / 2,
            text: 'Reputation:',
            ...gameOptions.fontYearbook,
            width: this.width - 2 * xDistances[0]
        });

        // create the reputation text
        this.reputation = Text({
            x: reputationTitle.x,
            y: reputationTitle.y + reputationTitle.height + yDistances[3],
            text: '',
            ...gameOptions.fontYearbook,
            width: this.width - 2 * xDistances[0]
        });

        // create hire/fire button
        this.hireFireButton = new Button(
            0,
            0,
            'Hire',
            '#58a23c',
            () => {
                this.clickButton();
            }
        );

        this.hireFireButton.x = this.x + this.width / 2 - this.hireFireButton.width / 2;
        this.hireFireButton.y = this.y + this.height - yDistances[2] - this.hireFireButton.height;

        // add all elements as childs
        this.addChild([
            this.shadow, this.background, this.name, this.picture,
            characteristicsTitle, this.characteristics,
            reputationTitle, this.reputation
        ]);


    }

    render() {
        super.render();

        if (this.hireFireButtonVisible) {
            this.hireFireButton.render();
        }

    }

    hideButton() {
        this.hireFireButtonVisible = false;
    }

    showButton(text: string) {
        this.hireFireButtonVisible = true;
        this.hireFireButton.setText(text);

        if (text == 'Fire') {
            this.hireFireButton.color = '#ec7c26';
        }
        else {
            this.hireFireButton.color = '#58a23c';
        }

    }

    clickButton() {

        emit('hireFire', this.tilePosition);

    }

}
