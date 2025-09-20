import {IPositionable} from "./interfaces";
import {getSin, getCos} from "./math";
import Grid, {GRID_SIZE_X, indexForPos} from "./grid";

export function drawPixels(offscreenCtx: CanvasRenderingContext2D, pixelValues: number[][], characterColorMap: string[], pixelSize: number, xOffset: number = 0, yOffset: number = 0, stroke = false) {
    offscreenCtx.imageSmoothingEnabled = false;  // Ensure no smoothing
    // Draw the pixel data onto the off-screen canvas without any scaling
    for (let y = 0; y < pixelValues.length; y++) {
        const row = pixelValues[y];
        for (let x = 0; x < row.length; x++) {
            const pixel = row[x];
            if (pixel === null) continue;
            const color = characterColorMap[pixel];
            if (color) {
                offscreenCtx.fillStyle = color;
                offscreenCtx.fillRect(x * pixelSize + xOffset, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

export function updatePos(x: number, y: number, object: IPositionable): void {
    object.pos.x = x;
    object.pos.y = y;
    object.center.x = object.pos.x + object.size.x / 2;
    object.center.y = object.pos.y + object.size.y / 2;
    object.index = indexForPos(object.pos.x, object.pos.y, GRID_SIZE_X);
    generateVertices(object);
}

export function generateVertices(object: IPositionable) {
    const { center, size, angle } = object;
    const { x: width, y: height } = size;
    // const { cos: cosAngle, sin: sinAngle } = getTrigValues(angle);
    const cosAngle = getCos(angle);
    const sinAngle = getSin(angle);

    object.vertices[0].x = -width / 2;
    object.vertices[0].y = -height / 2;
    object.vertices[1].x = width / 2;
    object.vertices[1].y = -height / 2;
    object.vertices[2].x = width / 2;
    object.vertices[2].y = height / 2;
    object.vertices[3].x = -width / 2;
    object.vertices[3].y = height / 2;

    for (const vertex of object.vertices) {
        const { x, y } = vertex;
        vertex.x = x * cosAngle - y * sinAngle + center.x;
        vertex.y = x * sinAngle + y * cosAngle + center.y;
    }
}