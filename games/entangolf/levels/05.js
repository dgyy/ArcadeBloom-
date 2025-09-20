import Level from "../level";

import Ball from "../ball";
import Hole from "../hole";

export default class extends Level {
    backgroundColor = "#f781b4";

    reset() {
        this.holes = [
            new Hole(this.width * 1.1/2, this.height / 4),
            new Hole(this.width * 1/4, this.height * 3 /4),

        ];
        this.balls = [
            new Ball(this.width / 2, this.height / 4, 0),
            new Ball(this.width / 2, this.height * 3/4, 0),
        ];
    }
}