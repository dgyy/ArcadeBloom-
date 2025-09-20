import { Sprite } from "kontra";
import { loadImage } from "./util";

export async function createHeart(canvas: HTMLCanvasElement): Promise<Sprite> {
    let img = await loadImage('../assets/heart.webp');
    let heart =  Sprite({
        anchor: { x: 0.5, y: 0.5 },
        image: img,
    });
    heart.setScale(canvas.width * 0.0003);
    heart.y = heart.world.height;
    return heart;
}

