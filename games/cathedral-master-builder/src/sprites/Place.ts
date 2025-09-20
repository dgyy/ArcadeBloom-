// imports
import {
    Text,
    track, emit
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import Worker from "../sprites/Worker.ts";
import random from "../helper/Random.ts";
import YearbookEntry from "./YearbookEntry.ts";

export default class Place {

    public readonly name: string;
    public readonly emoji: string;
    public readonly description: Text;
    public readonly image: Text;
    public indicator: Text;
    private readonly fullYearbook: YearbookEntry[];
    public readonly placeType: string;
    public readonly relevantResources: boolean[];
    public resources: number[];
    public workers: Worker[];
    public prices: number[];
    public helpString: string;
    private indicatorXDirection: number;

    constructor(x: number, y: number, name: string, emoji: string, placeType: string, relevantResources: boolean[], resources: number[], helpString: string) {

        // initialize variables
        this.fullYearbook = [];
        this.workers = [];
        this.resources = resources;
        this.prices = [];
        this.helpString = helpString;
        this.indicatorXDirection = 1;

        // store variables
        this.name = name;
        this.placeType = placeType;
        this.relevantResources = relevantResources;
        this.emoji = emoji;

        // create elements of the pieces on the main screen (picture, text and indicator text)
        this.image = Text({x: gameOptions.gameWidth * x, y: gameOptions.gameHeight * y, text: emoji, ...gameOptions.fontTitlePictures, onDown: () => {this.click()}});

        this.description = Text({
            x: this.image.x,
            y: this.image.y + this.image.height / 2 + gameOptions.gameHeight * 0.01,
            text: this.name, ...gameOptions.fontSubtitles, anchor: {x: 0.5, y: 0}, onDown: () => { this.click() }
        });

        this.indicator = Text({
            x: this.image.x,
            y: this.image.y - this.image.height / 2 - gameOptions.gameHeight * 0.02,
            text: '', ...gameOptions.fontSubtitles, anchor: {x: 0.5, y: 1}
        });

        // track the pointer down events
        track(this.image, this.description);

        // set all workers to empty
        for (let i = 0; i < 5; i++) {
            this.workers.push(new Worker('empty'));
        }

        this.reset();                           // reset everything

    }

    update() {

        if (this.placeType == 'w') {
            this.description.text = this.name + ' (' + String(this.numberOfWorkers()) + '/5)';
        }

        // fade the indicator
        if (this.indicator.opacity > 0) {
            this.indicator.opacity = this.indicator.opacity - 1 / (5 * 60);
        }

        // move the indicator
        if (this.indicator.y >= 0) {
            this.indicator.y = this.indicator.y - (0.05 * gameOptions.gameHeight) / 60;
        }

        // indicator wobbles
        if (this.indicator.x >= this.image.x + gameOptions.gameHeight * 0.01) {
            this.indicatorXDirection = -1;
        }
        else if (this.indicator.x <= this.image.x - gameOptions.gameHeight * 0.01) {
            this.indicatorXDirection = 1;
        }

        this.indicator.x = this.indicator.x + this.indicatorXDirection * (0.02 * gameOptions.gameWidth) / 60;

    }

    // action which happens if the image or the description is clicked
    click() {

        emit('clickPlace', this);

    }

    // action which happens when the place needs to be updated (on every tick)
    tick(year: number) {

        // increase the age of all workers
        for (let w of this.workers) {
            if (w.name != 'Empty') {
                w.birthday();
            }
        }

        if (this.placeType == 't') {

            // set the worker changes (!gameplay settings!)
            let workerLeaveChance = 0.25;            // chance that a worker leaves the town
            let newWorkerChance = 0.25;               // chance that the last two spots are filled

            // update all worker spots
            for (let i = 0; i < this.workers.length; i++) {

                // check if any of the workers is leaving and remove them
                if (this.workers[i].name != 'Empty' && Math.random() <= workerLeaveChance) {
                    this.workers[i] = new Worker('empty');
                }

                // add new workers in the empty spots: places 0 - 2 are always filled with one baker, smith and mason
                // remaining places are filled by chance and might also be empty
                if (this.workers[i].name == 'Empty') {

                    switch (i) {
                        case 0:
                            this.workers[0] = new Worker('baker');
                            break;
                        case 1:
                            this.workers[1] = new Worker('smith');
                            break;
                        case 2:
                            this.workers[2] = new Worker('mason');
                            break;
                        default:
                            if (Math.random() <= newWorkerChance) {

                                let jobChance = Math.random();
                                let job: string;

                                if (jobChance < 0.33) {         // one third chance to be a baker
                                    job = 'baker';
                                }
                                else if (jobChance < 0.66) {    // one third chance to be a smith
                                    job = 'smith';
                                }
                                else {
                                    job = 'mason';              // one third chance to be a mason
                                }

                                this.workers[i] = new Worker(job);
                            }
                    }

                }

            }

        }
        else if (this.placeType == 'm') {

            // generate new market prices
            this.prices = [Math.round(random.generateUniform(gameOptions.marketPriceMatrix[0])), Math.round(random.generateUniform(gameOptions.marketPriceMatrix[1]))];

        }
        else {

            let resourceMissingText = [
                    'money',             // 0: not enough money
                    'iron',              // 1: not enough iron
                    'stone',             // 2: not enough stone
                    'bread',             // 3: not enough bread
                    'tools'             // 4: not enough tools
                ];

            // create a new yearbook entry (everything empty)
            let yearbookEntry = new YearbookEntry();
            yearbookEntry.year = year;
            let resourceMissing = [false, false, false, false, false, false];       // the value will be changed to true if a resource is missing. This is used later to write the "events" in the yearbook

            for (let i = 0; i < this.workers.length; i++) {             // go through every worker and calculate production

                let tempWorker = this.workers[i];
                let enoughResources = true;                             // set the boolean which checks if there are enough resources!
                let tempProduction = [0, 0, 0, 0, 0, 0];

                // write the name of the worker into the yearbook
                if (tempWorker.job == 'empty') {
                    yearbookEntry.workerBalance[i].name = '-';
                }
                else {
                    yearbookEntry.workerBalance[i].name = tempWorker.name;
                }

                // go through each resource, calculate the temporary production and check if any resource is missing
                for (let j = 0; j < tempWorker.production.length; j++) {
                    if (this.relevantResources[j]) {                            // only calculate it for the relevant resources

                        // calculate the production based on the production base value and a random variation
                        tempProduction[j] = Math.round(tempWorker.production[j] + random.generateUniform([-tempWorker.variation[j], tempWorker.variation[j]]));


                        // check if enough resources are available if the production is negative
                        if (tempProduction[j] < 0 && this.resources[j] < Math.abs(tempProduction[j])) {

                            resourceMissing[j] = true;
                            enoughResources = false;

                        }
                    }
                }

                // update the resources and write it into the yearbook
                if (enoughResources) {

                    for (let j = 0; j < tempWorker.production.length; j++) {
                        if (this.relevantResources[j]) {                            // only set it for the relevant resources

                            this.resources[j] = this.resources[j] + tempProduction[j];
                            yearbookEntry.overallBalance[j] = yearbookEntry.overallBalance[j] + tempProduction[j];

                        }
                    }

                    // write the yearbook entry of this worker
                    yearbookEntry.workerBalance[i].balance = tempProduction;

                }
                else if (!resourceMissing[0]) {                             // if money is not missing, then still subtract the wage from the worker!
                    this.resources[0] = this.resources[0] + tempProduction[0];
                    yearbookEntry.overallBalance[0] = yearbookEntry.overallBalance[0] + tempProduction[0];

                    // write the yearbook entry of this worker
                    yearbookEntry.workerBalance[i].balance[0] = tempProduction[0];

                }

            }

            // write the events in the yearbook
            for (let i = 0; i < resourceMissing.length; i++) {
                if (resourceMissing[i]) {
                    yearbookEntry.events.push('Not enough ' + resourceMissingText[i]);
                }

            }

            // check if people die
            for (let i = 0; i < this.workers.length; i++) {
                if (this.workers[i].job != 'empty' && this.workers[i].dies() && yearbookEntry.events.length < 9) {      // check for each non empty worker if they die and if there are not yet too many events (to not overfill the yearbook)

                    if (this.placeType == 'b') {
                        yearbookEntry.events.push('Bishop ' + this.workers[i].name + ' (' + String(this.workers[i].age) + ') passed away ☠️!');  // write yearbook entry
                        this.workers[i] = new Worker('bishop');                      // replace with a new bishop
                        yearbookEntry.events.push('Welcome Bishop ' + this.workers[i].name + '!');  // write yearbook entry
                    }
                    else {
                        yearbookEntry.events.push(this.workers[i].name + ' (' + String(this.workers[i].age) + ') died ☠️!');  // write yearbook entry
                        this.workers[i] = new Worker('empty');                      // replace with empty worker
                    }



                }


            }

            // write the yearbook entry into the yearbook
            this.writeYearbookEntry(yearbookEntry);

            // write the indicator
            let symbols = ['💵','🧲','🧱','🥖','⚒️','⛪'];

            for (let i = this.relevantResources.length - 1; i >= 0; i--) {         // find the last true entry in the relevant resources array (as this is the resource which is produced in this workshop)
                if (this.relevantResources[i]) {

                    if (i == 5) {
                        this.indicator.text = '+' + (yearbookEntry.overallBalance[i] / 100).toFixed(2) + ' %'+ symbols[i];
                    }
                    else {
                        this.indicator.text = '+' + yearbookEntry.overallBalance[i] + symbols[i];
                    }


                    this.indicator.opacity = 1;                                                                 // reset the opacity of the indicator
                    this.indicator.y = this.image.y - this.image.height / 2 - gameOptions.gameHeight * 0.02;    // reset the y position of the indicator
                    this.indicator.x = this.image.x;                                                            // reset the y position of the indicator
                    break;
                }
            }

        }

    }

    // write a yearbook entry
    writeYearbookEntry(entry: YearbookEntry) {
        this.fullYearbook.push(entry);
    }

    // read a yearbook entry
    readYearbookEntry(year: number): YearbookEntry {

        // search for the entry of this year
        for (let i = 0; i < this.fullYearbook.length; i++) {
            if (this.fullYearbook[i].year == year) {
                return this.fullYearbook[i]
            }
        }

        return this.fullYearbook[this.fullYearbook.length - 1];    // if nothing was found just provide the last entry

    }

    // does a specific year in the yearbook exist? (needed to determine if the previous or next buttons need to be drawn
    yearExist(year: number): boolean {

        for (let i = 0; i < this.fullYearbook.length; i++) {

            if (year == this.fullYearbook[i].year) {
                return true;
            }

        }

        return false;

    }

    // get the number of workers (not counting the empty spaces)
    numberOfWorkers(): number {

        let count = 0;

        for (let i = 0; i < this.workers.length; i++) {

            if (this.workers[i].job != 'empty') {
                count++;
            }

        }

        return count;

    }

    // returns the next empty worker spot or -1 if there is no spot anymore free
    nextEmptyWorkerSpot(): number {

        for (let i = 0; i < this.workers.length; i++) {

            if (this.workers[i].job == 'empty') {
                return i;
            }

        }

        return -1;

    }

    reset() {

        // empty the yearbook
        this.fullYearbook.length = 0;

        // set first yearbook entry
        this.writeYearbookEntry({
            year: 1212,
            workerBalance: [
                {name: '-', balance: [0, 0, 0, 0, 0, 0]},
                {name: '-', balance: [0, 0, 0, 0, 0, 0]},
                {name: '-', balance: [0, 0, 0, 0, 0, 0]},
                {name: '-', balance: [0, 0, 0, 0, 0, 0]},
                {name: '-', balance: [0, 0, 0, 0, 0, 0]},
            ],
            overallBalance: [0, 0, 0, 0, 0, 0],
            events: ['No cathedral yet!']
        });

        // set the prices for iron and stone (only used for the market)
        this.prices = [Math.round(random.generateUniform(gameOptions.marketPriceMatrix[0])), Math.round(random.generateUniform(gameOptions.marketPriceMatrix[1]))];

        // set the empty workers
        for (let i = 0; i < 5; i++) {
            this.workers[i] = new Worker('empty');
        }

        // if the place is the bishop place, add the bishop
        if (this.placeType == 'b') {
            this.workers[0] = new Worker('bishop');
        }

    }

}