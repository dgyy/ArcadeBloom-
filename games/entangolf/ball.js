export default class Ball {

  mass = 1;
  numLastPositions = 50;
  
  constructor(x, y, startAngle = Math.PI, radius = 8, realBall = true, angleDir = 1) {
    this.radius = radius;
    this.color = "#fff";
    this.trailColor = "#fff";
    this.pos = { x, y };
    this.originalPos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.hole = null;
    this.mass = radius;
    this.startAngle = startAngle;
    this.pos.x = x;
    this.pos.y = y;
    this.alpha = 1.0;
    this.friction = 0;
    this.lastPositions = [];
    this.tick = 0;
    this.lastPosIndex = 0;
    this.hit = false;
    this.angleDir = angleDir;

    if (realBall) {
      for (let i = 0; i < this.numLastPositions; i++) {
        const ball = new Ball(x, y, startAngle, radius, false);
        ball.alpha = 0.0;
        ball.trailColor = this.trailColor;
        this.lastPositions.push(ball);
      }
    }
  }

  project(axis) {
    const centerProjection = this.pos.x * axis.x + this.pos.y * axis.y;
    return {
      min: centerProjection - this.radius,
      max: centerProjection + this.radius
    };
  }

  update() {
    this.tick++;
    // const BASE_FRICTION = 0.98;
    const MIN_VEL = 0.01;
    const currentFriction = .98 - this.friction;

    // Apply friction scaled by the timeFactor
    this.vel.x *= currentFriction;
    this.vel.y *= currentFriction;

    // If velocity is very small, set it to 0 to prevent jitter
    if (Math.abs(this.vel.x) < MIN_VEL) this.vel.x = 0;
    if (Math.abs(this.vel.y) < MIN_VEL) this.vel.y = 0;

    // Scale the movement step by the timeFactor
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (this.tick % 1 === 0) {
      const ball = this.lastPositions[this.lastPosIndex];
        ball.pos.x = this.pos.x;
        ball.pos.y = this.pos.y;
        ball.alpha = 0.25;
      this.lastPosIndex = (this.lastPosIndex + 1) % this.numLastPositions;
    }

    for (let i = 0; i < this.numLastPositions; i++) {
      const ball = this.lastPositions[i];
      ball.alpha -= 0.009;
    }
  }


  reset() {
    this.pos.x = this.originalPos.x;
    this.pos.y = this.originalPos.y;
    this.hole = null;
    this.vel.x = 0;
    this.vel.y = 0;
    this.alpha = 1.0;
    this.tick = 0;
    this.hit = false;

    for (let i = 0; i < this.numLastPositions; i++) {
      this.lastPositions[i] = new Ball(this.originalPos.x, this.originalPos.y, this.startAngle, this.radius);
      this.lastPositions[i].alpha = 0.0;
    }
  }
}
