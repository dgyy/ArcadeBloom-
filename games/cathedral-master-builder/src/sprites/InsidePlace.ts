import {
    Text,
    SpriteClass,
    track, on, emit
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import Book from "./Book.ts";
import AllWorkers from "./AllWorkers.ts";
import Place from "./Place.ts";

export default class InsidePlace extends SpriteClass {

    public visible: boolean;
    public bookVisible: boolean;
    public workersVisible: boolean;
    public workerButtonVisible: boolean;
    public bookButtonVisible: boolean;
    public title: Text;
    public cancelButton: Text;
    public helpButton: Text;
    private book: Book;
    private workers: AllWorkers;
    private workerButton: Text;
    private bookButton: Text;
    public place: Place;

    constructor(place: Place) {

        super({x: 0,
            y: 0,
            width: gameOptions.gameWidth,
            height: gameOptions.gameHeight,
            color: '#8d8d85'
        });             // create the background (parent sprite)

        // store variables
        this.place = place;

        // initialize variables
        this.visible = false;
        this.bookVisible = true;
        this.workersVisible = false;
        this.bookButtonVisible = false;
        this.workerButtonVisible = true;

        // create book
        this.book = new Book();

        // create worker tiles
        this.workers = new AllWorkers();

        // create title
        this.title = Text({
            x: this.width / 2,
            y: gameOptions.gameHeight * 0.06,
            text: 'Title',
            ...gameOptions.fontButtonProgress
        });

        // cancel button
        this.cancelButton = Text({
            x: gameOptions.gameWidth * 0.97,
            y: gameOptions.gameWidth * 0.03,
            text: '❎',
            ...gameOptions.fontButtonProgress,
            onDown: () => {
                this.hide();
                emit('makeClick');
            }
        });

        // help button
        this.helpButton = Text({
            x: this.cancelButton.x,
            y: gameOptions.gameHeight - gameOptions.gameHeight * 0.08,
            text: '❓',
            ...gameOptions.fontButtonProgress,
            onDown: () => {
                emit('showHelp', this.place);
            }
        });

        track(this.cancelButton, this.helpButton);

        // add all elements to the object as a child
        this.addChild([
            this.title, this.cancelButton, this.helpButton
        ]);

        // worker button
        this.workerButton = Text({
            x: this.cancelButton.x,
            y: this.book.page.y + this.book.page.height / 2,
            text: '🧔️',
            ...gameOptions.fontButtonProgress,
            onDown: () => {
                this.bookVisible = false;
                this.workersVisible = true;
                this.workerButtonVisible = false;
                this.bookButtonVisible = true;
                emit('makeClick');
            }
        });

        this.bookButton = Text({
            x: this.workerButton.x,
            y: this.workerButton.y,
            text: '📙',
            ...gameOptions.fontButtonProgress,
            onDown: () => {
                this.bookVisible = true;
                this.workersVisible = false;
                this.workerButtonVisible = true;
                this.bookButtonVisible = false;
                emit('makeClick');
            }
        });

        track(this.workerButton, this.bookButton);

        // events
        on('previousButton', () => {
            this.fillPageWorkshop(Number(this.book.year[0].text) - 1);
            emit('makeClick');
        });

        on('nextButton', () => {
            this.fillPageWorkshop(Number(this.book.year[0].text) + 1);
            emit('makeClick');
        });

    }

    update() {
        super.update();

        this.book.update();     // book is not added as a child and therefore needs to be updated, as the multi column grid needs to update to align again in case the text changed

        this.workers.setWorkerTiles(this.place.workers, this.place.placeType);      // update the worker tiles (as they might change!)

        this.workers.update();      // needs to be updated to ensure that the grid also updates its position (is not a child of this class)

        // check if the previous or next buttons need to be drawn
        this.book.showPreviousButton = this.place.yearExist(Number(this.book.year[0].text) - 1);

        this.book.showNextButton = this.place.yearExist(Number(this.book.year[0].text) + 1);

        if (this.place.placeType == 'm') {         // update the market page to ensure the current resources are visible
            this.fillPageMarket();
        }

    }

    render() {
        if (this.visible) {                 // only render the inside Place object when it is shown
            super.render();

            if (this.bookVisible) {
                this.book.render();
            }

            if (this.workersVisible) {
                this.workers.render();
            }

            if (this.bookButtonVisible) {
                this.bookButton.render();
            }

            if (this.workerButtonVisible) {
                this.workerButton.render();
            }

        }
    }

    show(place: Place, year: number) {
        this.visible = true;                // make it visible
        this.place = place;                 // store the place
        this.title.text = this.place.name + ' ' + this.place.emoji;  // set the title

        // set everything correct for a workshop
        if (this.place.placeType == 'w') {

            this.bookVisible = true;
            this.workersVisible = false;
            this.workerButtonVisible = true;
            this.bookButtonVisible = false;

            this.fillPageWorkshop(year);

        }
        else if (this.place.placeType == 'b') {

            this.bookVisible = true;
            this.workersVisible = false;
            this.workerButtonVisible = false;
            this.bookButtonVisible = false;

            this.fillPageWorkshop(year);

        }
        else if (this.place.placeType == 'm') {

            this.bookVisible = true;
            this.workersVisible = false;
            this.workerButtonVisible = false;
            this.bookButtonVisible = false;

            this.fillPageMarket();

        }
        else if (this.place.placeType == 't') {

            this.bookVisible = false;
            this.workersVisible = true;
            this.workerButtonVisible = false;
            this.bookButtonVisible = false;

        }

        // setup the worker page
        this.workers.setWorkerTiles(this.place.workers, this.place.placeType);

    }

    hide() {
        this.visible = false;
    }

    fillPageWorkshop(year: number) {

        let entry = this.place.readYearbookEntry(year);     // get the entry from the yearbook

        // left text
        let relevantResources = this.place.relevantResources;   // get the array with the relevant resources
        let resourceSymbols = [' 💵 ',' 🧲 ',' 🧱 ',' 🥖 ',' ⚒️ ',' ⛪ '];
        let textLeft: string[] = [];                        // initialize
        textLeft.push('Balance:', '', '', '', '', '', '', '');      // first title line and first entry of the resources line (empty)

        for (let i = 0; i < relevantResources.length; i++) {    // write resource symbols
            if (relevantResources[i]) {
                textLeft.push(resourceSymbols[i]);
            }
            else {
                textLeft.push(' ');
            }
        }

        for (let i = 0; i < entry.workerBalance.length; i++) {      // write worker balance

            // keep the line empty if there was no worker in the bishop place
            if (this.place.placeType == 'b' && entry.workerBalance[i].name == '-') {

                textLeft.push('','', '', '', '', '', '');

            }
            else {

                textLeft.push(entry.workerBalance[i].name);

                for (let j = 0; j < entry.workerBalance[i].balance.length; j++) {

                    if (relevantResources[j]) {

                        if (j == 5) {           // convert cathedral progress in %
                            textLeft.push((entry.workerBalance[i].balance[j] / 100).toFixed(2) + ' %');
                        }
                        else {
                            textLeft.push(String(entry.workerBalance[i].balance[j]));
                        }

                    }
                    else {
                        textLeft.push(' ');
                    }

                }

            }

        }

        textLeft.push('', '', '', '', '', '', '');
        textLeft.push('Overall:')

        for (let i = 0; i < entry.overallBalance.length; i++) {

            if (relevantResources[i]) {

                if (i == 5) {           // convert cathedral progress in %
                    textLeft.push((entry.overallBalance[i] / 100).toFixed(2) + ' %');
                }
                else {
                    textLeft.push(String(entry.overallBalance[i]));
                }




            }
            else {
                textLeft.push('');
            }

        }

        // right text (Events)
        let textRight: string[] = [];

        textRight.push('Events:');

        for (let i = 0; i < entry.events.length; i++) {

                textRight.push(entry.events[i]);

        }

        this.book.setupPages(entry.year,true,true, true,
            true, true, false, textLeft, textRight);

    }

    fillPageMarket() {

        // left text
        let textLeft = [
            'Your Resources:', '', '        ', '', '', '', '',
            '', '💵:', String(this.place.resources[0]), '', '', '', '',
            '', '🧲:', String(this.place.resources[1]), '', '', '', '',
            '', '🧱:', String(this.place.resources[2]), '', '', '', '',
            '', '🥖:', String(this.place.resources[3]), '', '', '', '',
            '', '⚒️:', String(this.place.resources[4]), '', '', '', '',
        ]

        this.book.setupPages(1212, false, true, false,
            true, false, true, textLeft, ['']);

        // update price next to buttons
        this.book.buyButtons[1].text = 'for ' + String(this.place.prices[0]) + '💵';
        this.book.buyButtons[3].text = 'for ' + String(this.place.prices[0] * 10) + '💵';
        this.book.buyButtons[7].text = 'for ' + String(this.place.prices[1]) + '💵';
        this.book.buyButtons[9].text = 'for ' + String(this.place.prices[1] * 10) + '💵';

    }


}
