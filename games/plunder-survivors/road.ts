import {IPoint, IEdge, IGridCell, IPositionable} from "./interfaces";
import {updatePos} from "./game_objects";

export const ROAD_WIDTH = 150;
export default class Road implements IPositionable {
    edge: IEdge;
    color: string;
    angle: number;
    size: IPoint = {x: ROAD_WIDTH, y: 0};
    pos: IPoint = {x: 0, y: 0};
    center: IPoint = {x: 0, y: 0};
    occupiedCells: IGridCell[] = new Array(2000).fill(null);
    numOccupiedCells: number = 0;
    vertices: IPoint[] = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x:0, y: 0}];
    index: number = 0;

    constructor(edge: IEdge, boundingBox: IPoint) {
        this.color = "#5f80c0";
        this.edge = edge;
        this.size = {x: ROAD_WIDTH, y: 0};
        this.angle = Math.atan2(edge.v1.y - edge.v0.y, edge.v1.x - edge.v0.x) + Math.PI / 2;
        const pos = posFromEdge(this.edge);
        updatePos(pos.x, pos.y, this);
    }

    draw(ctx: CanvasRenderingContext2D, scale: number = 1) {
        ctx.save();
        ctx.translate(this.center.x*scale, this.center.y*scale);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size.x/2*scale, -this.size.y/2*scale, this.size.x*scale, this.size.y*scale);
        ctx.restore();
    }
}

function posFromEdge(edge: IEdge): IPoint {
    const dx = edge.v1.x - edge.v0.x;
    const dy = edge.v1.y - edge.v0.y;
    const height = Math.hypot(dx, dy);
    const middlePos = { x: edge.v0.x + dx / 2, y: edge.v0.y + dy / 2 };
    const pos = { x: middlePos.x - ROAD_WIDTH / 2, y: middlePos.y - height / 2 };
    return pos;
}