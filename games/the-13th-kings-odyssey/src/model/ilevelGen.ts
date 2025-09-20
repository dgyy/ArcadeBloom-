export interface ILevelGen {
    key: string,
    tileSize: number,
    width: number,
    height: number,
    backGround: ITile,
    platform: ITile,
    objectsTiles: ITile,
    collision: Array<number>
}

export interface ITile {
    spriteSrc: string,
    tileSheetColumns: number,
    tileIndexStart: number,
    data: Array<number>
}