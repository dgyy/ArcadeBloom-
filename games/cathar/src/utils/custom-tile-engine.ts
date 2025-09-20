import {GameObjectClass, getCanvas, getWorldRect, imageAssets, randInt, TileEngine, TileEngineClass} from "kontra";
import {weightedRandNumber} from "../utils/rand-util";

interface TileLayer {
    opacity: number
    data: number[]
    scale: number
}


interface TileSet {
    firstgid: number
    margin: number
    image: any
    columns: number
}

/**
 * Get the row from the y coordinate.
 * @private
 *
 * @param {Number} y - Y coordinate.
 * @param {Number} tileheight - Height of a single tile (in pixels).
 *
 * @return {Number}
 */
function getRow(y: number, tileheight: number) {
    return (y / tileheight) | 0;
}

/**
 * Get the col from the x coordinate.
 * @private
 *
 * @param {Number} x - X coordinate.
 * @param {Number} tilewidth - Width of a single tile (in pixels).
 *
 * @return {Number}
 */
function getCol(x: number, tilewidth: number) {
    return (x / tilewidth) | 0;
}


class CustomTileEngine extends TileEngineClass {
    // @ts-ignore kontra default
    layerMap: Record<string, TileLayer>

    layerCollidesWith(name: string, object: any) {
        const {tilewidth, tileheight, layerMap} = this;
        const {x, y, width, height} = getWorldRect(object);
        const layer = layerMap[name];

        const row = getRow(y, tileheight * layer.scale);
        const col = getCol(x, tilewidth * layer.scale);
        const endRow = getRow(y + height, tileheight * layer.scale);
        const endCol = getCol(x + width, tilewidth * layer.scale);


        // check all tiles
        for (let r = row; r <= endRow; r++) {
            for (let c = col; c <= endCol; c++) {
                if (layer.data[c + r * this.width]) {
                    return true;
                }
            }
        }

        return false;
    }

    _r(layer: TileLayer, context: CanvasRenderingContext2D) {
        const {opacity, data = [], scale = 1} = layer;
        const {tilesets, width, tilewidth, tileheight} = this;

        context.save();
        context.globalAlpha = opacity;
        context.imageSmoothingEnabled = false;
        // context.scale(scale, scale)

        data.map((tile, index) => {
            // skip empty tiles (0)
            if (!tile) return;

            // find the tileset the tile belongs to
            // assume tilesets are ordered by firstgid
            let tileset: TileSet
            for (let i = tilesets.length - 1; i >= 0; i--) {
                tileset = tilesets[i] as TileSet;

                if (tile / tileset.firstgid >= 1) {
                    break;
                }
            }

            // @ts-ignore
            const {image, margin = 0, firstgid, columns} = tileset;
            const offset = tile - firstgid;
            const cols = columns ?? (image.width / (tilewidth + margin)) | 0;
            const scaleOffset = scale

            const x = (index % width) * tilewidth;
            const y = ((index / width) | 0) * tileheight;
            const sx = (offset % cols) * (tilewidth + margin);
            const sy = ((offset / cols) | 0) * (tileheight + margin);

            context.drawImage(
                image,
                sx,
                sy,
                tilewidth,
                tileheight,
                x,
                y,
                tilewidth,
                tileheight
            );
        });

        context.restore();
    }
}