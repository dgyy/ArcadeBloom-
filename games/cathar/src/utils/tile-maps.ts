import {getCanvas, imageAssets, TileEngine} from "kontra";
import {weightedRandNumber} from "./rand-util";


export function getBackGroundTileMap(xTiles: number, yTiles: number) {
    const randomData: number[] = []
    for (let i = 0; i < xTiles * yTiles; i++) {
        randomData.push(16)
    }

    return randomData
}
