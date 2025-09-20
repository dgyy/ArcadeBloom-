import { Context } from "./canvas";
import { hsla } from "./color";
import { isEven } from "./math";
import { randomInt } from "./random";
import { Vector2 } from "./vector";

const drawCRTStatic = (
    ctx: Context,
    w: number,
    h: number,
    passes = new Vector2(5, 20),
) => {
    ctx.save();

    for (let y = 0; y < passes.y; y++) {
        for (let x = 0; x < w; x += passes.x) {
            ctx.fillStyle = hsla(0, 0, randomInt(0, 100), 0.02);
            ctx.fillRect(x, y, passes.x, 1);
        }
    }

    const imageData = ctx.getImageData(0, 0, w, passes.y);
    for (let y = 0; y < h; y += passes.y) {
        ctx.putImageData(imageData, 0, y);
    }

    ctx.restore();
};

const drawCRTLines = (ctx: Context, w: number, h: number) => {
    ctx.save();

    for (let y = 0; y < h; y++) {
        const even = isEven(y);
        const alpha = even ? 0.1 : 0.05;
        const light = even ? 0 : 100;
        ctx.fillStyle = hsla(0, 0, light, alpha);
        ctx.fillRect(0, y, w, 1);
    }

    ctx.restore();
};

const drawCRTGradient = (ctx: Context, w: number, h: number) => {
    ctx.save();

    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h);
    gradient.addColorStop(0, hsla(0, 0, 100, 0.05));
    gradient.addColorStop(1, hsla(0, 0, 0, 0.2));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
};

export const generateCRTVignette = (ctx: Context, w: number, h: number) => {
    drawCRTStatic(ctx, w, h);
    drawCRTLines(ctx, w, h);
    drawCRTGradient(ctx, w, h);

    return ctx.getImageData(0, 0, w, h);
};