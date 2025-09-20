export interface IPosition {
  x: number;
  y: number;
}
export interface ISize {
  width: number;
  height: number;
}

export default abstract class GameObject {
  id: number;
  ctx: CanvasRenderingContext2D;
  position: IPosition;
  size: ISize;

  constructor(ctx: CanvasRenderingContext2D, id: number, position: IPosition = { x: 0, y: 0 }, size: ISize = { width: 0, height: 0 }) {
    this.ctx = ctx;
    this.id = id;
    this.position = position;
    this.size = size;
  }

  getPositionCenter(): IPosition {
    return {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2
    };
  }

  isCollisionWithObject(gameObject: GameObject): boolean {
    return (
      this.position.x + this.size.width >= gameObject.position.x &&
      this.position.x <= gameObject.position.x + gameObject.size.width &&
      this.position.y + this.size.height >= gameObject.position.y &&
      this.position.y <= gameObject.position.y + gameObject.size.height
    );
  }
}
