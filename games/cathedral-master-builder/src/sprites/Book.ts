import {
    Text,
    Sprite,
    SpriteClass,
    Grid,
    emit,
    track, GameObject
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import Line from "./Line.ts"
import Button from "./Button.ts";

export default class Book extends SpriteClass {

    private readonly shadow: Sprite;
    private readonly cover: Sprite;
    public readonly page: Sprite;
    private readonly lineSeparator: Line;
    public year: Text[];
    private showYear: boolean;
    private showLinesLeft: boolean;
    private showLinesRight: boolean;
    private readonly linesLeft: Grid;
    private readonly linesRight: Grid;
    private showTextLeft: boolean;
    private showTextRight: boolean;
    private showBuyButtons: boolean;
    private textRight: Text[];
    private textLeft: Text[];
    public buyButtons: GameObject[];
    private textRightGrid: Grid;
    private textLeftGrid: Grid;
    private buyButtonsGrid: Grid;
    public showNextButton: boolean;
    public showPreviousButton: boolean;
    private nextButton: Text;
    private previousButton: Text;

    constructor() {

        super({x: 0,
            y: 0,
            width: 0,
            height: 0
        });             // create the background (parent sprite)

        // initialize variables
        this.year = [];
        this.showYear = true;
        this.showLinesLeft = true;
        this.showLinesRight = true;
        this.showTextRight = true;
        this.showTextLeft = true;
        this.showBuyButtons = true;
        this.showNextButton = true;
        this.showPreviousButton = true;

        // parameters
        let shadowDistance = gameOptions.gameWidth * 0.01;      // distance of the shadow
        let coverWidth = gameOptions.gameWidth * 0.01;          // book cover width
        let lineNum = 9;               // number of writing lines per page
        let gapsY = [
            gameOptions.gameHeight * 0.03,          // 0: year from page top
            gameOptions.gameHeight * 0.02,          // 1: title line from title
            gameOptions.gameHeight * 0.12,          // 2: writing lines from title year
            gameOptions.gameHeight * 0.07           // 3: gap between lines
        ];

        // create cover
        this.cover = Sprite({
            x: gameOptions.gameWidth * 0.01,
            y: gameOptions.gameHeight * 0.12,
            width: gameOptions.gameWidth * 0.9,
            height: gameOptions.gameHeight * 0.85,
            color: '#4A0404'
        });

        // create shadow
        this.shadow = Sprite({
            x: this.cover.x + shadowDistance,
            y: this.cover.y + shadowDistance,
            width: this.cover.width,
            height: this.cover.height,
            color: 'black',
            opacity: 0.3
        });

        // create page
        this.page = Sprite({
            x: this.cover.x + coverWidth,
            y: this.cover.y + coverWidth / 2,
            width: this.cover.width - 2 * coverWidth,
            height: this.cover.height - coverWidth,
            color: '#eddaa8'
        });

        // create separator line between the pages
        this.lineSeparator = new Line({
            x: this.cover.x + this.cover.width / 2,
            y: this.page.y,
            length: this.page.height,
            horizontal: false,
            width: 1,
            color: 'black',
        });

        // create year title on the top of the page
        for (let i = 0; i < 2; i++) {
            this.year.push(Text({
                x: this.page.x + this.page.width * (0.25 + 0.5 * i),        // adds the title in the middle of the left side (0.25) and in the middle of the right side (0.75)
                y: this.page.y + gapsY[0],
                text: '1213',
                ...gameOptions.fontSubtitles,
                color: 'black',
                anchor: {x: 0.5, y: 0}
            }));
        }

        // add all childern (barebone of the book without lines and text) to the sprite
        this.addChild([this.shadow, this.cover, this.page, this.lineSeparator]);

        // create lines for writing
        let separateLinesLeft: Line[] = [];
        let separateLinesRight: Line[] = [];

        let lineStartX = this.page.x + 2 * coverWidth;  // set the x coordinate where the line should start
        let lineLength = this.page.width / 2 - 4 * coverWidth;  // length of the lines
        let lineProperties = {
            x: 0,
            y: 0,
            horizontal: true,
            width: 1,
            color: 'black'        // color does not work
        };

        for (let i = 0; i < lineNum; i++) {     // create the separate lines

            separateLinesLeft.push(new Line({
                ...lineProperties,
                length: lineLength
            }));

            separateLinesRight.push(new Line({
                ...lineProperties,
                length: lineLength
            }));

        }

        this.linesLeft = Grid({                 // add the lines to a grid
            x: lineStartX,
            y: this.year[0].y + this.year[0].height + gapsY[2],
            rowGap: gapsY[3],
            children: separateLinesLeft
        });

        this.linesRight = Grid({                 // add the lines to a grid
            x: lineStartX + lineLength + 4 * coverWidth,
            y: this.year[0].y + this.year[0].height + gapsY[2],
            rowGap: gapsY[3],
            children: separateLinesRight
        });

        // create the texts
        this.textRight = [];
        this.textLeft = [];
        let numCol = 7;             // number of columns for the left text
        let textProperties = {
            x: 0,
            y: 0,
            text: 't',
            ...gameOptions.fontYearbook
        }

        for (let i = 0; i < lineNum; i++) {     // create the text lines

            this.textRight.push(Text(textProperties));

            for (let j = 0; j < numCol; j++) {
                this.textLeft.push(Text(textProperties));
            }
        }

        let textY = this.linesLeft.y - Number(this.linesLeft.rowGap) * 0.6;
        let textRowGap = Number(this.linesLeft.rowGap) - this.textLeft[0].height;
        let textColGap = gameOptions.gameWidth * 0.01;

        this.textRightGrid = Grid( {
            x: this.linesRight.x,
            y: textY,
            rowGap: textRowGap,
            children: this.textRight
        });

        this.textLeftGrid = Grid( {
            x: this.linesLeft.x,
            y: textY,
            rowGap: textRowGap,
            colGap: textColGap,
            numCols: numCol,
            flow: 'grid',
            justify: ['start', 'end', 'end', 'end', 'end', 'end', 'end'],
            children: this.textLeft
        });

        // create the buy buttons and texts
        let buttonRowGap = gameOptions.gameHeight * 0.04;
        let buttonColumnGap = gameOptions.gameWidth * 0.01;

        this.buyButtons = [];
        let buyAmount = [
            10,
            100,
            10,
            100
        ];

        let buyResourceType = [1, 1, 2, 2];     // 1: Iron, 2: Stone

        let buyResourceEmoji = '🧲';

        for (let i = 0; i < 4; i++) {

            this.buyButtons.push(new Button(
                0, 0, 'Buy ' + String(buyAmount[i]) + buyResourceEmoji, '#8d8d85',() => {
                    emit('buy', buyResourceType[i], buyAmount[i]);
                }
            ))

            this.buyButtons.push(Text({
                text: 'for 100',
                ...gameOptions.fontYearbook,
                color: 'black'
            }));

            if (i == 1) {
                this.buyButtons.push(Text({text: ''}), Text({text: ''}));     // gap between the two resource types
                buyResourceEmoji = '🧱';                                                        // change emoji
            }
        }

        this.buyButtonsGrid = Grid( {
            x: this.linesRight.x + gameOptions.gameWidth * 0.1,
            y: this.linesRight.y - gameOptions.gameHeight * 0.05,
            rowGap: buttonRowGap,
            colGap: buttonColumnGap,
            numCols: 2,
            flow: 'grid',
            justify: 'center',
            align: 'center',
            children: this.buyButtons
        });

        // next and previous buttons
        let distanceButton = 0.01 * gameOptions.gameWidth;

        this.previousButton = Text({
            x: this.page.x + distanceButton,
            y: this.page.y + distanceButton,
            text: '⬅️',
            ...gameOptions.fontButtonProgress,
            anchor: {x: 0, y: 0},
            onDown: () => {emit('previousButton');}
        });

        this.nextButton = Text({
            x: this.page.x + this.page.width - distanceButton,
            y: this.page.y + distanceButton,
            text: '➡️',
            ...gameOptions.fontButtonProgress,
            anchor: {x: 1, y: 0},
            onDown: () => {emit('nextButton');}
        });

        track(this.previousButton, this.nextButton);

    }

    update() {
        super.update();

        this.textLeftGrid.update();     // left grid needs to be updated to align the columns if the text changes

    }

    render() {
        super.render();

        if (this.showYear) {           // render the left lines only if they are shown
            for (let i = 0; i < this.year.length; i++) {
                this.year[i].render();
            }
        }


        if (this.showLinesLeft) {           // render the left lines only if they are shown
            this.linesLeft.render();
        }

        if (this.showLinesRight) {           // render the right lines only if they are shown
            this.linesRight.render();
        }


        if (this.showTextRight) {           // render the right text only if they are shown
            this.textRightGrid.render();
        }

        if (this.showTextLeft) {           // render the left text only if they are shown
            this.textLeftGrid.render();
        }

        if (this.showPreviousButton) {           // render the button only if shown
            this.previousButton.render();
        }

        if (this.showNextButton) {           // render the button only if shown
            this.nextButton.render();
        }

        if (this.showBuyButtons) {
            this.buyButtonsGrid.render();
        }

    }

    // setup the pages
    setupPages(year: number, showYear: boolean, linesLeft: boolean, linesRight: boolean,
               textLeft: boolean, textRight: boolean, buyButtons: boolean,
               contentLeft: string[], contentRight: string[]) {

        // set year
        for (let i = 0; i < this.year.length; i++) {
            this.year[i].text = String(year);
        }

        // define what should be shown
        this.showYear = showYear;
        this.showLinesLeft = linesLeft;
        this.showLinesRight = linesRight;
        this.showTextRight = textRight;
        this.showTextLeft = textLeft;
        this.showBuyButtons = buyButtons;


        if (this.showTextRight) {
            for (let i = 0; i < this.textRight.length; i++) {

                if (i < contentRight.length) {
                    this.textRight[i].text = contentRight[i];
                }
                else {
                    this.textRight[i].text = '';
                }

            }
        }

        if (this.showTextLeft) {

            for (let i = 0; i < this.textLeft.length; i++) {

                if (i < contentLeft.length) {
                    this.textLeft[i].text = contentLeft[i];
                }
                else {
                    this.textLeft[i].text = '';
                }

            }
        }

    }

}
