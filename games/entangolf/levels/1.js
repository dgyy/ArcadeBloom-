import Level from "../level";

import Ball from "../ball";
import Hole from "../hole";

export default class extends Level {
  backgroundColor = "#8eb087";
  
  reset() {
    this.holes = [new Hole(this.width * 3/4, this.height / 2)];
    this.balls = [new Ball(this.width / 2, this.height / 2)];
  }
}