export default class Arrow {
  constructor(startX = 0, startY = 0, angle = 0, magnitude = 1) {
    this.startPos = { x: startX, y: startY };
    this.angle = angle;
    this.magnitude = magnitude; // Fixed typo from `this.magnitude = 1`
    this._endPos = { x: startX, y: startY };

  }
  get endPos() {
    this._endPos.x = this.startPos.x + this.magnitude * Math.cos(this.angle);
    this._endPos.y = this.startPos.y + this.magnitude * Math.sin(this.angle);
    return this._endPos;
  }
}