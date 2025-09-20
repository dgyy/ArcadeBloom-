import { Animations } from "./common.model";

export interface ILevel {
    levelNumber: number;
    tileDataKey: string;
    player: IPlayer;
    door: IDoor;
    collisions: any;
    collisionsSymbolKey: number;
    hazard?: Array<IHazard>;
    enemies?: Array<any>;
    collectibales?: Array<any>;
    dashPoints?: Array<any>;

    init?: () => void;
}

export interface IPlayer {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}

export interface IDoor {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}

export interface IEnemies {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
    canMove: boolean;
    isMoveHorzontal: boolean,
    isMoveVertical: boolean,
    waitAtEndTime: number;
    moveLength: number;
    moveSpeed: number;
}

export interface IHazard {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}

export interface ICollectibles {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}

export interface IDashPoint {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}