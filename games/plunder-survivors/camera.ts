import {IPoint} from "./interfaces";
import Boat from "./boat";
import { clamp} from "./math";

export default class Camera {
    pos: IPoint;  // The position of the camera.
    maxZoom: number; // The zoom level of the camera.
    currentZoom: number;
    minZoom: number;
    canvasSize: IPoint;
    worldSize: IPoint;
    scale: number;
    screenShake: {
        duration: number;
        magnitude: number;
        elapsed: number;
        active: boolean;
    }
    offset: IPoint = {x: 0, y: 0};
    viewableBounds: { topLeft: IPoint, bottomRight: IPoint };

    constructor(pos: IPoint, maxZoom: number, minZoom: number, canvasSize: IPoint, worldSize: IPoint, scale:number) {
        this.pos = pos;
        this.maxZoom = maxZoom;
        this.currentZoom = maxZoom;
        this.minZoom = minZoom;
        this.canvasSize = canvasSize;
        this.worldSize = worldSize;
        this.scale = scale;
        this.screenShake = {
            duration: .1,
            magnitude: 0,
            elapsed: 0,
            active: false,
        }
        this.viewableBounds = { topLeft: {x: 0, y: 0}, bottomRight: {x: 0, y: 0}};
    }

    setOffset(x: number, y: number) {
        this.offset.x = x;
        this.offset.y = y;
    }

    resetOffset() {
        this.offset.x = 0;
        this.offset.y = 0;
    }

    centerOn(target: Boat) {
        const sign = target.speed > 1 ? -1 : 1;
        this.currentZoom = clamp(this.currentZoom + sign * .01, this.minZoom, this.maxZoom);

        let targetX = target.center.x - this.canvasSize.x / 2 / this.currentZoom;
        let targetY = target.center.y - this.canvasSize.y / 2 / this.currentZoom;

        targetX = clamp(targetX, 0, this.worldSize.x - this.canvasSize.x / this.currentZoom);
        targetY = clamp(targetY, 0, this.worldSize.y - this.canvasSize.y / this.currentZoom);

        this.pos.x = targetX + this.offset.x;
        this.pos.y = targetY + this.offset.y;

        this.viewableBounds.topLeft.x = this.pos.x;
        this.viewableBounds.topLeft.y = this.pos.y;
        this.viewableBounds.bottomRight.x = (this.pos.x + this.canvasSize.x / this.currentZoom);
        this.viewableBounds.bottomRight.y = (this.pos.y + this.canvasSize.y / this.currentZoom);
    }
}