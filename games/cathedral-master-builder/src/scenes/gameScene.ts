// imports
import {
    emit,
    Grid,
    on,
    SceneClass, Sprite,
    Text, track
} from 'kontra';
import {gameOptions} from "../helper/gameOptions.ts";
import Place from "../sprites/Place.ts";
import InsidePlace from "../sprites/InsidePlace.ts";
import Worker from "../sprites/Worker.ts";
import Popup from "../sprites/Popup.ts";
import {helpTexts} from "../helper/Data.ts";
import YearProgress from "../sprites/YearProgress.ts";
import Sound from "../helper/Sound.ts";

// Game scene: Main game scene
export default class GameScene extends SceneClass {

    private gameState: number;
    private resourcesText!: Grid;
    private resources: number[];
    private places: Place[];
    private year!: Text;
    private progressText!: Text;
    private tickLength!: number;        // length of one tick in ms
    private lastTickTime!: number;      // time when the last tick happened
    private nextTick!: number;           // number of the next tick
    private newYearTime: number;        // time when a new year started
    private insidePlace!: InsidePlace;
    private popup!: Popup;
    private helpString!: string;
    private helpButton!: Text;
    private yearProgress!: YearProgress;
    private audioContext: AudioContext;
    private sound!: Sound;
    private cathedralReveal!: Sprite;

    constructor(id: string) {

        super({id: id});

        // initialize all variables
        this.gameState = -1;
        this.resources = [0, 0, 0, 0, 0, 0];
        this.places = [];
        this.newYearTime = 0;
        this.lastTickTime = 0;
        this.audioContext = new AudioContext();

    }

    onShow() {

        this.sound = new Sound(this.audioContext);

        // help text and button
        this.helpString = 'Welcome to the 13th century, a time when magnificent cathedrals adorn the skyline of every major city, except yours.\n\n' +
            'You\'ve been appointed as the CATHEDRAL MASTER BUILDER by the bishop to build a cathedral before the century\'s end.\n\n' +
            'The bishop✝️ provides money💵 for your project. Visit the TOWN🏘️ to recruit skilled workers for your BAKERY🥖, SMITHY⚒️, and MASONRY🧱. ' +
            'Procure iron🧲 and stone🧱 from the MARKET🧺.\n\n' +
            'For detailed guidance and information, explore each location.'

        this.helpButton = Text({
            x: gameOptions.gameWidth * 0.97,
            y: gameOptions.gameHeight - gameOptions.gameWidth * 0.03,
            text: '❔',
            ...gameOptions.fontButtonProgress,
            onDown: () => {
                emit('showHelp');
            }
        });

        track(this.helpButton);

        // year
        this.year = Text({text: '1213', ...gameOptions.fontTitlePictures, x: gameOptions.gameWidth * 0.55, y: gameOptions.gameHeight * 0.1});

        // year progress
        this.yearProgress = new YearProgress(this.year.x - this.year.width / 2, this.year.y + gameOptions.gameHeight * 0.07, this.year.width);

        // resources text
        this.resourcesText = Grid({
            x: gameOptions.gameWidth * 0.01,
            y: gameOptions.gameWidth * 0.01,
            rowGap: gameOptions.gameHeight * 0.02,
            colGap: 0,
            numCols: 2,
            flow: 'grid',
            children: [
                Text({text: '💵: ', ...gameOptions.fontSubtitles}),
                Text({text: '', ...gameOptions.fontSubtitles}),
                Text({text: '🧲: ', ...gameOptions.fontSubtitles}),
                Text({text: '', ...gameOptions.fontSubtitles}),
                Text({text: '🧱: ', ...gameOptions.fontSubtitles}),
                Text({text: '', ...gameOptions.fontSubtitles}),
                Text({text: '🥖: ', ...gameOptions.fontSubtitles}),
                Text({text: '', ...gameOptions.fontSubtitles}),
                Text({text: '⚒️: ', ...gameOptions.fontSubtitles}),
                Text({text: '', ...gameOptions.fontSubtitles})
            ]
        });

        // places
        this.places.push(new Place(0.05, 0.55, 'Market', '🧺', 'm',
            [false, false, false, false, false, false], this.resources, helpTexts[0]));
        this.places.push(new Place(0.05, 0.85, 'Town', '🏘️', 't',
            [false, false, false, false, false, false], this.resources, helpTexts[1]));
        this.places.push(new Place(0.23, 0.75, 'Bishop', '✝️', 'b',
            [true, false, false, false, false, false], this.resources, helpTexts[2]));
        this.places.push(new Place(0.39, 0.35, 'Bakery', '🥖', 'w',
            [true, false, false, true, false, false], this.resources, helpTexts[3]));
        this.places.push(new Place(0.71, 0.35, 'Smithy', '⚒️', 'w',
            [true, true, false, true, true, false], this.resources, helpTexts[4]));
        this.places.push(new Place(0.87, 0.75, 'Masonry', '🧱', 'w',
            [true, false, true, true, true, true], this.resources, helpTexts[5]));

        // create cathedral
        let cathedral = Text({
            x: 0.55 * gameOptions.gameWidth,
            y: 0.63 * gameOptions.gameHeight,
            text: '⛪',
            font: '180px Arial',
            color: 'white',
            anchor: {x: 0.5, y: 0.5},
            textAlign: 'center'
        });

        let cathedralDescription = Text({
            x: cathedral.x,
            y: cathedral.y + cathedral.height / 2 + gameOptions.gameHeight * 0.01,
            text: 'Cathedral',
            ...gameOptions.fontSubtitles,
            anchor: {x: 0.5, y: 0}
        });

        // progress
        this.progressText = Text({text: '', ...gameOptions.fontButtonProgress, color: 'white', x: gameOptions.gameWidth * 0.55, y: gameOptions.gameHeight * 0.94});

        // cathedral reveal
        this.cathedralReveal = Sprite({
            x: cathedral.x - cathedral.width / 2,
            y: cathedral.y - cathedral.height / 2 - gameOptions.gameHeight * 0.04,
            width: cathedral.width,
            height: cathedral.height + gameOptions.gameHeight * 0.04,
            opacity: 0.75,
            color: '#58a23c',
        });

        this.cathedralReveal.initialHeight = this.cathedralReveal.height;       // store the initial height of the reveal overlay

        // initialize inside place
        this.insidePlace = new InsidePlace(this.places[1]);

        // initialize popup
        this.popup = new Popup();

        // add elements to scene
        this.add([this.year, this.yearProgress, this.resourcesText, cathedral, cathedralDescription, this.progressText, this.helpButton, this.cathedralReveal]);

        for (let p of this.places) {        // add all places
            this.add([p.image, p.description, p.indicator]);
        }

        this.add([this.insidePlace, this.popup]);   // need to be added at the end to ensure it is on top

        // Event when clicking on any of the places
        on('clickPlace', (place: Place) => {

            if (!this.insidePlace.visible && !this.popup.visible && this.gameState == 0) {
                this.insidePlace.show(place, Number(this.year.text));
                this.sound.click();
            }

        });

        // Event when the hire or fire button is pressed
        on('hireFire', (tilePosition: number) => {
           this.hireFire(tilePosition);
        });

        // buying resources
        on('buy', (type: number, amount: number) => {
            this.buyResources(type, amount);
        });

        // show help
        on('showHelp', (place?: Place) => {
            this.showHelp(place);
        });

        // event when the popup "OK" is clicked (for actions when the game is started or finished
        on('popupClick', () => {

            this.sound.click();

            if (this.gameState == -1) {     // if game is not running yet, start it when the ok is clicked on the popup (when the final message is shown
                this.gameState = 0;
                this.newYearTime = Date.now();
                this.lastTickTime = Date.now();         // set the last tick time to now so that it starts from the beginning

            }
            else if (this.gameState == 1) {     // restart the scene when the game is finished and someone clicked on the popup ok (when the final message is shown)
                this.restartGame();
            }

        });

        // event when something should click (used for inside place things: Cancel button, book and worker button, change change buttons)
        on('makeClick', () => {
            this.sound.click();
        })

        // tick system setup
        this.tickLength = Math.round(gameOptions.yearLength * 1000 / this.places.length);           // calculate tick length

        // trigger the restart to set everything up
        this.restartGame();

    }

    update() {
        super.update();

        this.sound.playMusic();

        // update the place
        for (let p of this.places) {        // add all places
            p.update();
        }

        if (this.gameState == 0) {

            // update the year progress bar
            this.yearProgress.setBar((Date.now() - this.newYearTime) / (gameOptions.yearLength * 1000));

            // let the emoji flicker of the place which is currently working
            this.places[this.nextTick].image.scaleX = 1 - Math.cos(Date.now() / 100) * 0.05;
            this.places[this.nextTick].image.scaleY = 1 - Math.cos(Date.now() / 100) * 0.05;

            // tick system
            if (Date.now() - this.lastTickTime > this.tickLength) {         // check if the next tick is due and execute it

                this.lastTickTime = Date.now();                 // set the last tick time to now
                this.places[this.nextTick].tick(Number(this.year.text));              // execute the tick on the place
                this.nextTick++;                                // increase the tick counter

                if (this.nextTick >= this.places.length) {

                    this.nextTick = 0;                                              // set the tick counter to 0
                    this.year.text = String(Number(this.year.text) + 1);      // increase the year
                    this.newYearTime = Date.now();                                    // set the new year timer (for the year progress bar) to now

                }

            }

        }


        // update resources text (not for the cathedral!)
        for (let i = 0; i < this.resources.length - 1; i++) {
            this.resourcesText.children[i*2 + 1].text = String(this.resources[i]);
        }

        // check if the game was finished
        if (this.resources[5] >= 10000 && Number(this.year.text) <= 1300) {

            this.gameState = 1;

            this.popup.show('Congratulations!\n\nYou\'ve completed the cathedral before the 13th century\'s close (' + this.year.text +  '), restoring your city\'s glory and earning the bishop\'s pride!\n\nPlay again?');

            this.insidePlace.hide();

        }
        else if (this.resources[5] >= 10000) {

            this.gameState = 1;

            this.popup.show('The cathedral is finally completed, but alas, it\'s a bit too late (' + this.year.text +  ').\n\nThe 13th century has already come to an end, and other cities have stolen the spotlight with their faster progress.\n\n Play again?');

            this.insidePlace.hide();

        }

        // update the cathedral progress and reveal cathedral
        this.progressText.text = (this.resources[5] / 100).toFixed(2) + ' %';
        this.cathedralReveal.height = this.cathedralReveal.initialHeight * (1 - this.resources[5] / 10000);

    }

    render() {
        super.render();

    }

    restartGame() {

        // set the initial game state
        this.gameState = -1;                // -1: Starting, 0: Running, 1: End

        // set the year back to 1213
        this.year.text = '1213';

        // initialize resources
        for (let i = 0; i < this.resources.length; i++) {
            this.resources[i] = 0;
        }

        // initialize the places
        for (let i = 0; i < this.places.length; i++) {
            this.places[i].reset();
        }

        // setup the tick system
        this.nextTick = 0;                                                                             // set the next tick to 0

        // show the initial popup
        this.popup.show(this.helpString);

    }

    // action when the hire or fire button is pressed
    hireFire(tilePosition: number) {

        this.sound.click();

        let placeClicked = this.insidePlace.place;

        if (placeClicked.name == 'Town') {

            let destinationPlace: Place;

            // define which type of worker it was
            switch (this.places[1].workers[tilePosition].job) {
                case 'baker':
                    destinationPlace = this.places[3];              // add to bakery
                    break;
                case 'smith':
                    destinationPlace = this.places[4];              // add to smithy
                    break;
                default:
                    destinationPlace = this.places[5];              // add to masonry
            }

            // add worker to the destination
            let emptyPosition = destinationPlace.nextEmptyWorkerSpot();

            if (emptyPosition == -1) {
                this.popup.show('You have already 5 workers in the ' + destinationPlace.name);
            }
            else {
                destinationPlace.workers[destinationPlace.nextEmptyWorkerSpot()] = placeClicked.workers[tilePosition];
                placeClicked.workers[tilePosition] = new Worker('empty');       // remove worker from the place
            }
        }
        else {                                                                  // fire worker
            placeClicked.workers[tilePosition] = new Worker('empty');       // remove worker from the place
        }

    }

    buyResources(type: number, amount: number) {

        this.sound.click();

        let price = this.places[0].prices[type - 1] * amount / 10;

        if (price <= this.resources[0]) {

            this.resources[0] = this.resources[0] - price;
            this.resources[type] = this.resources[type] + amount;

        }
        else {

            this.popup.show('Not enough money!');

        }

    }

    showHelp(place?: Place) {

        this.sound.click();

        let helpString: string;

        if (typeof place !== 'undefined') {                           // help from a place was clicked
            helpString = place.helpString;
        }
        else {
            helpString = this.helpString;
        }

        this.popup.show(helpString);

    }

}