import {names, emojiYoung, emojiOld} from "../helper/Data.ts";
import random from "../helper/Random.ts";
import {gameOptions} from "../helper/gameOptions.ts";

export default class Worker {

    public name: string;
    public age: number;
    public wage!: number;
    public emoji!: string;
    public job: string;
    public jobEmoji!: string;
    public readonly production: number[];
    public readonly variation: number[];
    public readonly reputation: string[];

    constructor(job: string) {

        this.job = job;
        if (this.job == 'empty') {
            this.name = 'Empty';
        }
        else {
            this.name = this.getRandom(names);            // get a random name
        }

        // get a random age

        let age = [10, 25];             // minimum and maximum age (!gameplay setting!)
        let ageBishop = [20, 30];       // minimum and maximum age of bishop (!gameplay setting!)

        if (this.job == 'bishop') {
            this.age = Math.round(random.generateUniform(ageBishop))    // different age for the bishop (cannot be a child)
        }
        else {
            this.age = Math.round(random.generateUniform(age));
        }

        this.setEmoji();                                                        // set face (based on age) and job emoji
        this.jobEmoji = '🥖';

        // setup the base production
        this.production = [0, 0, 0, 0, 0, 0];
        this.variation = [0, 0, 0, 0, 0, 0];
        this.reputation = [];
        this.setValues();

    }

    getRandom(list: string[]) {

        return list[Math.floor(Math.random() * list.length)];

    }

    setEmoji() {

        if (this.age <= 18) {                                                   // get a random emoji
            this.emoji = this.getRandom(emojiYoung);
        }
        else {
            this.emoji =  this.getRandom(emojiOld);
        }

    }

    birthday() {
        this.age = this.age + 1;

        if (this.age == 19) {       // set a new emoji (old guy) when he turns 19
            this.setEmoji();
        }

    }

    dies(): boolean {

        let curveValue = 1 / (1 + Math.exp( (-this.age + 40) / 1.5));  // sigmoide function is used here: (1/(1+e^( (-x + expectancy) / flatness ))

        return Math.random() <= curveValue;                 // return true (worker dies) if the random value is smaller than the curve value and vice versa

    }

    // set the base production values, variations, wage and reputation
    setValues() {

        // create the reputation matrix (!gameplay setting!)
        let reputationMatrix = [
                [''],                       // 0: money consumption (not used!)
                [''],                       // 1: money production (no used)
                ['👎Inefficient', '🙂Efficient'],   // 2: iron consumption (smith)
                [''],                       // 3: iron production (not used!)
                ['👎Inefficient', '🙂Efficient'],   // 4: stone consumption (mason)
                [''],                       // 5: stone production (not used!)
                ['👎Hungry', '🙂Small Appetite'],   // 6: bread consumption (smith, mason)
                ['👎Lazy', '🙂Hard working'],       // 7: bread production (baker)
                ['👎Inefficient', '🙂Efficient'],   // 8: tool consumption (mason)
                ['👎Lazy', '🙂Hard working'],       // 9: tool production (smith)
                [''],                       // 10: cathedral consumption (not used!)
                ['👎Lazy', '🙂Hard working'],       // 11: cathedral production (mason)
            ];

        // create the production matrix (!gameplay setting!)
        let productionMatrix = [
            [0, 0, 0],          // 0: money consumption (not used, will be calculated based on wage)
            [270, 330, 30],     // 1: money production (bishop)
            [-15, -5, 3],       // 2: iron consumption (smith)
            [0, 0, 0],          // 3: iron production (not used!)
            [-20, -10, 3],      // 4: stone consumption (mason)
            [0, 0, 0],          // 5: stone production (not used!)
            [-15, -5, 3],       // 6: bread consumption (smith, mason)
            [30, 50, 10],        // 7: bread production (baker)
            [-10, -4, 3],       // 8: tool consumption (mason)
            [8, 16, 3],        // 9: tool production (smith)
            [0, 0, 0],          // 10: cathedral consumption (not used!)
            [30, 50, 10],        // 11: cathedral production (mason)
        ];

        let profile: number[] = [];

        // set the production / consumption profile (-1: nothing, 0: consumption, 1: production)
        if (this.job == 'baker') {
            profile = [0, -1, -1, 1, -1, -1];
        }
        else if (this.job == 'smith') {
            profile = [0, 0, -1, 0, 1, -1];
            this.jobEmoji = '⚒️';
        }
        else if (this.job == 'mason') {
            profile = [0, -1, 0, 0, 0, 1];
            this.jobEmoji = '🧱';
        }
        else if (this.job == 'bishop') {
            profile = [1, -1, -1, -1, -1, -1];
        }
        else if (this.job == 'empty') {
            profile = [-1, -1, -1, -1, -1, -1];
        }

        // calculate the random production values and the variation (based on profile)
        let wageFactorCounter = 0;
        let wageFactorCounterMax = 0;
        let minMaxVar: number[] = [];     // array with minimum, maximum and variation
        let reputation: string[] = [];      // array with the reputations

        for (let i = 0; i < profile.length; i++) {

            if (profile[i] > -1) {

                wageFactorCounterMax++;
                minMaxVar = productionMatrix[i*2 + profile[i]];
                reputation = reputationMatrix[i*2 + profile[i]];

                this.production[i] = Math.round(random.generateUniform(minMaxVar));     // get random production (based on matrix)
                this.variation[i] = minMaxVar[2];                                       // get variation

                if (this.production[i] > minMaxVar[0] + 0.75 * (minMaxVar[1] - minMaxVar[0])) {     // good production (high) / good consumption (low)
                    this.reputation.push(reputation[1]);

                    wageFactorCounter++;

                }
                else if (this.production[i] < minMaxVar[0] + 0.25 * (minMaxVar[1] - minMaxVar[0])) {     // bad production (low) / bad consumption (high)
                    this.reputation.push(reputation[0]);

                    wageFactorCounter--;

                }

            }

        }

        // calculate wage (if many values are good -> high salary, if many values are bad -> low salary)
        if (this.job != 'empty') {

            let wageFactor = wageFactorCounter/wageFactorCounterMax;
            this.wage = Math.round(
                (gameOptions.wage[0] + gameOptions.wage[1]) / 2
                + wageFactor * (gameOptions.wage[1] - gameOptions.wage[0]) / 2
                + random.generateUniform([-gameOptions.wage[2], gameOptions.wage[2]]));        // calculation: average wage + f * wage range + variation

            if (this.job != 'bishop') {
                this.production[0] = -this.wage;
            }

        }

    }


}