export default class SpriteSheet {
  #img;
  constructor(imgPath) {
    this.#img = new Image();
    this.#img.src = imgPath;
  }
  get img() {
    return this.#img;
  }
  async load() {
    return new Promise((resolve) => {
      this.#img.onload = () => {
        resolve();
      };
    });
  }
}
