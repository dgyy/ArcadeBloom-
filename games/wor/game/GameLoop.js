export default class GameLoop {
  #onUpdate;
  #rafID;
  #isStopped = false;

  #lastTs = 0;
  #frame = 0;

  #frameTimer;
  #frameTimerLimit;

  #gameTime = 0;

  constructor(onUpdate, fps = 60) {
    this.#onUpdate = onUpdate;
    this.#frameTimerLimit = Math.floor(1000 / fps);
    this.#frameTimer = this.#frameTimerLimit;
  }

  start() {
    this.#isStopped = false;
    this.#rafID = requestAnimationFrame(this.#update.bind(this));
  }

  stop() {
    this.#isStopped = true;
    cancelAnimationFrame(this.#rafID);
  }

  #update(ts) {
    if (this.#isStopped) {
      return;
    }

    const delta = Math.floor(ts - this.#lastTs);
    this.#gameTime += delta;

    if (this.#frameTimer <= this.#frameTimerLimit) {
      this.#frameTimer += delta;
    } else {
      this.#frameTimer = this.#frameTimerLimit;
      this.#onUpdate({ timeElapsed: delta, gameTime: this.#gameTime });
      this.#lastTs = ts;
    }

    this.#rafID = requestAnimationFrame(this.#update.bind(this));
  }
}
