export default class YearbookEntry {

    public year: number
    public workerBalance: WorkerEntry[]
    public overallBalance: number[]
    public events: string[]

    constructor() {

        // initialize variables
        this.year = 1212;
        this.workerBalance = [];
        this.overallBalance = [0, 0, 0, 0, 0, 0];
        this.events = [];

        // create worker balance
        for (let i = 0; i < 5; i++) {

            this.workerBalance.push(new WorkerEntry());

        }

    }

}

class WorkerEntry {

    public name: string;
    public balance: number[];

    constructor() {

        this.name = '';
        this.balance = [0, 0, 0, 0, 0, 0];

    }

}
