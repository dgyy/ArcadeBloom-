import { angleToTarget, movePoint, SpriteClass, Animation } from "kontra";

interface Props {
  x: number;
  y: number;
  translateY?: number;
  direction?: "up" | "down" | "left" | "right";
  flipHorizontally?: boolean;
  animations: {
    atRest: Animation;
    up?: Animation;
    down?: Animation;
    left?: Animation;
    right?: Animation;
  };
}

type Coordinate = { x: number; y: number };

function directionBetween(
  from: Coordinate,
  to: Coordinate,
): "up" | "down" | "left" | "right" | "atRest" {
  if (from.x !== to.x) {
    return to.x - from.x < 0 ? "left" : "right";
  }
  if (from.y !== to.y) {
    return to.y - from.y < 0 ? "up" : "down";
  }

  return "atRest";
}

export default class InteractiveSprite extends SpriteClass {
  private movingTo: null | { x: number; y: number } = null;

  // enforce typing of props passed in more strictly
  constructor(props: Props) {
    super(props);
  }

  init(props: Props) {
    super.init({
      ...props,
      width: 16,
      height: 16,
      anchor: { x: 0, y: 0 },
    });

    this.playAnimation("atRest");
  }

  isMoving(): boolean {
    return !!this.movingTo;
  }

  moveTo(x: number, y: number): boolean {
    if (this.movingTo) {
      return false;
    }

    const direction = directionBetween(this, { x, y });
    if (direction === "atRest") {
      return false;
    }

    if (!this.animations[direction]) {
      return false;
    }

    this.movingTo = { x, y };
    this.playAnimation(direction);
    return true;
  }

  playAnimation(name: string) {
    if (this.currentAnimationName !== name) {
      this.currentAnimationName = name;
      const flipHorizontally =
        (this.direction === "left" && name == "atRest") || name === "left";
      this.scaleX = flipHorizontally ? -1 : 1;
      this.translateX = flipHorizontally ? 16 : 0;
      super.playAnimation(name);
    }
  }

  update() {
    this.advance();

    if (this.movingTo) {
      const distancePerFrame = 1; // pixels
      const angle = angleToTarget(this, this.movingTo);
      const { x: nextX, y: nextY } = movePoint(this, angle, distancePerFrame);
      let next = { x: Math.round(nextX), y: Math.round(nextY) };

      const remainingDistance = Math.hypot(
        this.movingTo.x - next.x,
        this.movingTo.y - next.y,
      );

      if (remainingDistance <= distancePerFrame) {
        next = this.movingTo;
        this.movingTo = null;
      }

      this.x = next.x;
      this.y = next.y;
    } else if (this.currentAnimationName !== "atRest") {
      this.playAnimation("atRest");
    }
  }

  render() {
    if (!this.translateX && !this.translateY) {
      super.render();
      return;
    }

    const context = this.context;
    context.save();

    this.context.translate(this.translateX || 0, this.translateY || 0);

    super.render();

    context.restore();
  }
}
