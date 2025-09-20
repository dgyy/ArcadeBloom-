import Ghost from "./ghost";
import Road from "./road";

export interface IPoint {
    x: number;
    y: number;
}

export interface IPoolPoint extends IPoint, IPoolable {
}

export interface IPoolable {
    active: boolean;
}

export interface IEdge {
    v0: IPoint;
    v1: IPoint;
    color?: CanvasColor;
}

export interface ICircle {
    center: IPoint;
    radius: number;
}

export interface ITriangle extends IPolygon {
    vertices: IVertices3;
}

export interface IPolygon extends ICenterable {
    vertices: IPoint[];
}

export type CanvasColor = string | CanvasGradient | CanvasPattern;

export interface ICenterable {
    center: IPoint;
}



export interface ISpeedable {
    speed: number;
}

export interface IDropOff extends IPolygon {
    type: "empty" | "depot" | "x-mark" | "plundered";
    dropOffPoint: IPoint;
}

export interface IVoronoiResult {
    edges: IEdge[];
    polygons: IPolygon[];
}

export interface ITriangleInTriangulation extends ITriangle {
    circumcircle: ICircle;
    neighbors: ITriangleInTriangulation[];
}

export interface IBounds {
    topLeft: IPoint;
    bottomRight:IPoint;
}

export interface IPositionable extends ICenterable {
    pos: IPoint;
    angle: number;
    size: IPoint;
    vertices: IPoint[];
    occupiedCells: IGridCell[];
    numOccupiedCells: number;
    index: number;
}


export interface IQueueItem extends IPoolable {
    x: number; // cellIndex
    y: number; // depth
}

export interface ICollision {
    depth: number;
    edge: IEdge;
}

export interface IGridCell {
    index: number;
    cost: number;
    enemies: Ghost[];
    roads: Road[];
    numEnemies: number;
    numRoads: number;
}

export interface IKeyboardInputState {
    left: number;
    right: number;
    up: number;
    down: number;
}

export interface IInputState {
    pos: IPoint;
    pressed: boolean;
    doubleTapped: boolean;
}

export interface IVehicleInputState {
    mode: "kb" | "js";
    pos: IPoint;
}

export interface IVertices3 extends Array<IPoint> {
    0: IPoint;
    1: IPoint;
    2: IPoint;
    length: 3;
}
export interface IGold extends IPositionable, ICircle, IPoolable, IUpdateable {
    target: IPoint;
    offset: IPoint;
    updateDelay: number;
    updateable: boolean;
    drawable: boolean;
    arrivalCallback: (gold: IGold) => void;
    arrived: boolean;
    pixelCanvas: HTMLCanvasElement;
}

export interface IUpdateable {
    update(t: number): void;
}

export interface IRegion extends IPolygon, IDropOff, ISpeedable {
    edges: IEdge[];
    insideEdges: IEdge[];
    polygonEdges: IEdge[];
    shrunkPolygon: IPolygon;
    gold: IGold[];
}

export type IVector = IPoint;

export interface IUpgrade {
    name: string;
    currentLevel: number;
    maxLevel: number;
    cost: number;
}