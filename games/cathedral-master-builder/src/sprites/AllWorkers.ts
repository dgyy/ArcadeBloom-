import {
    SpriteClass
} from 'kontra'
import {gameOptions} from "../helper/gameOptions.ts";
import WorkerTile from "./WorkerTile.ts";
import Worker from "./Worker.ts";

export default class AllWorkers extends SpriteClass {

    public tiles: WorkerTile[];

    constructor() {

        super({x: 0,
            y: 0,
            width: 0,
            height: 0
        });             // create the background (parent sprite)

        // parameters
        let workerX = gameOptions.gameWidth * 0.01;

        // create separate worker tiles and place them
        this.tiles = [];

        this.tiles.push(new WorkerTile(workerX, 0));     // create first worker at proper position

        let workerDistance = this.tiles[0].width + gameOptions.gameWidth * 0.01;

        for (let i = 1; i < 5; i++) {       // create five tiles

            this.tiles.push(new WorkerTile(this.tiles[i-1].x + workerDistance, i));

        }

        // add all children (bare bone of the book without lines and text) to the sprite
        this.addChild(this.tiles);

    }

    setWorkerTiles(workers: Worker[], placeType: string) {

        for (let i = 0; i < workers.length; i++) {

            this.tiles[i].name.text = workers[i].name;              // set name

            if (workers[i].name != 'Empty') {

                this.tiles[i].picture.text = workers[i].emoji;          // set emoji
                this.tiles[i].job.text = workers[i].jobEmoji;                // set job
                this.tiles[i].age.text = String(workers[i].age);        // set age
                this.tiles[i].wage.text = String(workers[i].wage);      // set wage

                if (workers[i].reputation.length <= 0) {
                    this.tiles[i].reputation.text = '-';
                }
                else {

                    let reputationText = workers[i].reputation[0];

                    for (let j = 1; j < workers[i].reputation.length; j++) {

                        reputationText = reputationText + '\n' + workers[i].reputation[j];

                    }

                    this.tiles[i].reputation.text = reputationText;
                }

                // hire fire button
                if (placeType == 't') {
                    this.tiles[i].showButton('Hire');
                }
                else {
                    this.tiles[i].showButton('Fire');
                }

            }
            else {

                this.tiles[i].picture.text = '⬜';                      // set emoji
                this.tiles[i].job.text = '-';                            // set job
                this.tiles[i].age.text = '-';                            // set age
                this.tiles[i].wage.text = '-';                           // set wage
                this.tiles[i].reputation.text = '-';

                this.tiles[i].hideButton();                             // do not show hire and fire button

            }

        }

    }


}
