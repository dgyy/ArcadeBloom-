import { Ecom } from "./Ecom.js";
import { Stages } from "./Stages.js";

export class Game {
  constructor(v, a, i) {
    this.v = v;
    this.a = a;
    this.i = i;
    v.game = this;
    this.running = false;
    this.pf = null; // Pending Frame
    this.pvtime = 0;
    this.i.kh.Escape = () => this.end();
    this.ecom = new Ecom(this, this.v, this.a, this.i);
    this.stg = new Stages();
  }
  
  /*IGNORE{*/
  whenReady() {
    return Promise.all([
      this.a.loadUncompiledSongs(),
      this.stg.loadUncompiledStages(),
    ]);
  }
  /*}IGNORE*/

  begin() {
    if (this.running) return;
    this.running = true;
    this.stp = 0;
    this.ecom.reset(this.stg.v[this.stp]);
    this.pvtime = Date.now();
    this.pf = window.requestAnimationFrame(() => this.update());
  }
  
  end() {
    this.v.end();
    this.a.end();
    this.i.end();
    this.running = false;
    if (this.pf) {
      window.cancelAnimationFrame(this.pf);
      this.pf = null;
    }
  }
  
  update() {
    this.pf = null;
    if (!this.running) return;
    this.a.update();
    const state = this.i.update();
    const now = Date.now();
    let elapsed = now - this.pvtime;
    if (elapsed >= 10) { // Wait until sufficient time has passed. Maximum 100 Hz.
      if (elapsed > 20) { // Updating slower than 50 Hz, clamp it and run slow.
        elapsed = 20;
      }
      this.ecom.update(elapsed / 1000, state);
      this.pvtime = now;
      this.ecom.render();
    }
    this.pf = window.requestAnimationFrame(() => this.update());
  }
  
  nextStage() {
    this.stp++;
    if (this.stp >= this.stg.v.length) {
      this.stp = -1;
      return null;
    }
    return this.stg.v[this.stp];
  }
}
