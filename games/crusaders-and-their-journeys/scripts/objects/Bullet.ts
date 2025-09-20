import { calculateHypotenuse, changeImageColor } from "../utils";
import GameObject, { IPosition } from "./GameObject";
import bulletImage from "../../../assets/bullet.webp";

interface IPositionMovement {
  start: IPosition;
  end: IPosition;
}
interface IMovementTrajectory {
  step: IPosition;
  direction: IPosition;
}

export default class Bullet extends GameObject {
  bulletImage: HTMLImageElement | HTMLCanvasElement;
  positionMovement: IPositionMovement;
  movementTrajectory: IMovementTrajectory;
  velocity: number;

  constructor(ctx: CanvasRenderingContext2D, positionMovement: IPositionMovement, id: number, velocity: number,  color?: string) {
    super(ctx, id);

    this.id = id;
    this.bulletImage = new Image();
    this.bulletImage.src = bulletImage;
    this.size = {
      width: this.bulletImage.width,
      height: this.bulletImage.height
    };
    this.positionMovement = this.correctPositionMovement(positionMovement);
    this.position = {
      x: positionMovement.start.x,
      y: positionMovement.start.y
    };
    this.movementTrajectory = calculateHypotenuse(
      this.positionMovement.start,
      this.positionMovement.end
    );
    this.velocity = velocity;

    if (color) {
      this.bulletImage.addEventListener("load", () => {
        this.bulletImage = changeImageColor(this.bulletImage as HTMLImageElement, color);
      });
    }
  }
  private correctPositionMovement({ start, end }: IPositionMovement): IPositionMovement {
    const bulletCenterEnd: IPosition = {
      x: end.x - this.size.width / 2,
      y: end.y - this.size.height / 2
    };

    return {
      start,
      end: bulletCenterEnd
    };
  }
  public render() {
    this.draw();
    this.move();
  }
  private draw() {
    this.ctx.drawImage(this.bulletImage, this.position.x, this.position.y);
  }
  private move() {
    const { step, direction } = this.movementTrajectory;

    this.position.x += step.x * this.velocity * direction.x;
    this.position.y += step.y * this.velocity * direction.y;
  }
}
