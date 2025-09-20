import { SCREENW, SCREENH } from "./constants.js";
import { BTN_A, BTN_B, BTN_START } from "./Input.js";

export class Video {
  constructor() {
    this.src = document.querySelector("img"); // If the game needs multiple images, you might need to adjust the HTML minifier.
    this.cv = document.querySelector("canvas");
    this.cv.width = SCREENW;
    this.cv.height = SCREENH;
    this.c = this.cv.getContext("2d");
    this.bcv = document.createElement("CANVAS");
    this.bcv.width = SCREENW;
    this.bcv.height = SCREENH;
    this.bc = this.bcv.getContext("2d");
  }
  
  end() {
    this.c.fillStyle = "#888";
    this.c.fillRect(0, 0, SCREENW, SCREENH);
  }
  
  bg() {
    this.c.drawImage(this.bcv, 0, 0);
  }

  rect(x, y, w, h, c) {
    this.c.fillStyle = c;
    this.c.fillRect(x, y, w, h);
  }
  
  blit(dx, dy, sx, sy, w, h) {
    this.c.drawImage(this.src, sx, sy, w, h, dx, dy, w, h);
  }
  
  flop(dx, dy, sx, sy, w, h) {
    this.c.save();
    this.c.translate(dx + w/2, dy + h/2);
    this.c.scale(-1, 1);
    this.c.drawImage(this.src, sx, sy, w, h, -w/2, -h/2, w, h);
    this.c.restore();
  }
  
  decint(x, y, v, dc) {
    v = Math.floor(v);
    let p = 10 ** dc;
    let started = 0;
    for (; p>=1; p/=10, x+=4) {
      const digit = Math.floor(v / p) % 10;
      if (!digit && !started && (p > 1)) continue;
      started = 1;
      this.blit(x, y, 88 + 3 * digit, 15, 3, 5);
    }
  }
  
  bblit(dx, dy, sx, sy, w, h) {
    this.bc.drawImage(this.src, sx, sy, w, h, dx, dy, w, h);
  }
  
  bflop(dx, dy, sx, sy, w, h) {
    this.bc.save();
    this.bc.translate(dx + w/2, dy + h/2);
    this.bc.scale(-1, 1);
    this.bc.drawImage(this.src, sx, sy, w, h, -w/2, -h/2, w, h);
    this.bc.restore();
  }
}
